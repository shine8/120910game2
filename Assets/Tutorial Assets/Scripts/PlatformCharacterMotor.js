//キャラクターの動きを制御するスクリプト
//入力操作スクリプト(PlatformInputController2)により代入された値を元に、キャラクターを動かす

//このスクリプトが必要とするコンポーネント(無いときは一緒に付加される)
@script RequireComponent(CharacterController)

//プロパティ
var canControl :boolean = true; //操作入力を有効にするかどうか
var movement :PlatformerControllerMovement;    //移動情報(このインスタンスはスクリプトが生成する)
var jump :PlatformerControllerJumping; //ジャンプ情報(このインスタンスはスクリプトが生成する)

//内部で使用する変数
private var controller : CharacterController;   //キャラクターの物理処理を担う、CharacterControllerの参照
//移動する地面への対応(内部で使用する変数)
private var activePlatform : Transform; //地面のゲームオブジェクトのTransform(位置・回転・スケール情報)
private var activeLocalPlatformPoint : Vector3; //地面からみたキャラクターのローカル座標
private var activeGlobalPlatformPoint : Vector3;    //地面のグローバル座標
private var lastPlatformVelocity : Vector3; //直近の地面の移動速度

//@HideInInspectorは、Inspectorビューにプロパティとして表示させないための定義

//操作情報
@HideInInspector
var inputMove : Vector3;    //移動入力
@HideInInspector
var inputRun : float;   //ダッシュ入力
@HideInInspector
var inputJump : boolean;    //ジャンプ入力

//スクリプトの導入時に一度だけ呼ばれる関数
//内部で使用する変数の初期導入をする
function Awake () {

    controller = GetComponent(CharacterController) as CharacterController;  //CharacterControllerの取得と代入
    
    //フィールド(メンバ変数)の初期化
    movement = new PlatformerControllerMovement();
    jump = new PlatformerControllerJumping();
}


//入力操作やキャラクターの状態により、キャラクターの移動を制御する
private function UpdateSmoothedMovementDirection () {

    //カメラからみたX-Z(前後左右)方向を割り出す
    var cameraTransform : Transform = Camera.main.transform;
    var forward : Vector3 = cameraTransform.TransformDirection(Vector3.forward);    //カメラからの前方向を、グローバル空間の値で取得
    forward.y = 0;  //上下は必要がないので0にする
    forward = forward.normalized;   //正規化(ベクトルの大きさを1に)する

    var right : Vector3 = new Vector3(forward.z, 0, -forward.x);    //カメラからの前方向のベクトルを、右向きに変えたベクトル
	
	//操作不可なら移動入力の値を0にする
    if (!canControl)
    {
        inputMove = Vector3.zero;
    }
	
    movement.isMoving = Mathf.Abs (inputMove.x) > 0.1f || Mathf.Abs(inputMove.z) > 0.1f;    //入力操作が一定値以上あれば、移動しているとする
    movement.direction = inputMove.x * right + inputMove.z * forward;   //前後移動の入力操作から、移動方向のベクトルを計算して代入する
    
    //地面に接触している
    if (controller.isGrounded) {
        var curSmooth :float = movement.speedSmoothing * Time.deltaTime;    //移動の速さの変動を滑らかにするための値を計算
        		
        var targetSpeed: float = Mathf.Min(movement.direction.magnitude, 1);    //操作の重み(移動キーを押している時間)から、速さの比率を計算する。値は0~1の範囲。
	
	
        //ダッシュしていて操作可能な場合はダッシュの速さを掛け合わせる
        if (inputRun && canControl){
	        targetSpeed *= movement.runSpeed;   
	    }
        else{
	        targetSpeed *= movement.walkSpeed;  //歩きの速さを掛け合わせる
        }
		
        movement.speed = Mathf.Lerp (movement.speed, targetSpeed, curSmooth);   //現在の速さと新しい速さから、滑らかに変動するように新しい速さを計算をして代入する
		
        movement.hangTime = 0.0f;   //空中にいる時間をリセットする。
    }
    else {
        movement.hangTime += Time.deltaTime;    //空中にいる時間を加算する
        
        if (movement.isMoving){ //移動中なら
            var moveX: Vector3 = new Vector3 (Mathf.Sign(inputMove.x), 0, 0);   //ベクトルのXの値は、計算上inputMove.xが0~1で1に、0未満~-1で-1になる。
	        movement.inAirVelocity += moveX * Time.deltaTime * movement.inAirControlAcceleration;   //空中での移動速度を加算する
        }
    }
}

//ジャンプの入力操作処理
//ジャンプが可能な場合はジャンプする
private function ApplyJumping () {
    //最後にジャンプした時間との間隔が短い場合などは処理しない
    if (jump.lastTime + jump.repeatTime > Time.time)
    {
        return;
    }

    //キャラクターが地面に接触している
    if (controller.isGrounded)
    {
        //ジャンプが有効で、最後のジャンプ入力からあまり時間が経過していない場合は処理しない
        if (jump.enabled && Time.time < jump.lastButtonTime + jump.timeout) {
	        movement.verticalSpeed = CalculateJumpVerticalSpeed (jump.height);  //ジャンプの垂直方向の速さを取得して代入
	        movement.inAirVelocity = lastPlatformVelocity;  //空中の速度に対して地面の速度を代入する
	        SendMessage ("DidJump", SendMessageOptions.DontRequireReceiver);    //メッセージを送信する。これにより、ゲームオブジェクトに付加されているスクリプトコンポーネントのDidJump関数が呼ばれる
        }
    }
}

//重力の適用処理
//重力に応じてジャンプが頂点に達したかどうかを更新したり、キャラクターの落下速度を加速させる。
private function ApplyGravity () {
	
	//操作が無効ならば、ジャンプフラグをfalse(NO)にする
    if (!canControl)
    {
        inputJump = false;
    }
	
    //ジャンプが頂点に達した時に、メッセージを送信する
    if (jump.jumping && !jump.reachedApex && movement.verticalSpeed <= 0.0) {
        jump.reachedApex = true;
        SendMessage ("DidJumpReachApex", SendMessageOptions.DontRequireReceiver);   //メッセージを送信する。これにより、ゲームオブジェクトに付加されているスクリプトコンポーネントのDidJumpReachApex関数が呼ばれる
    }

    if (controller.isGrounded)
    {
        movement.verticalSpeed = -movement.gravity * Time.deltaTime;    //地面に接触しているときも重力の加速度を加えて、キャラクターが浮かないようにする
    }
    else
    {
        movement.verticalSpeed -= movement.gravity * Time.deltaTime;    //垂直方向の速さに重力の加速度を加える
    }
		
    //落下の速さが最大を越えないように再代入する
    movement.verticalSpeed = Mathf.Max (movement.verticalSpeed, -movement.maxFallSpeed);
}

//ジャンプの高さと重力を元に、垂直の早さを計算して返す
private function CalculateJumpVerticalSpeed(targetJumpHeight :float) : float {
    return Mathf.Sqrt (2 * targetJumpHeight * movement.gravity);
}

//ジャンプをし始めたときに、SendMessage関数により自動で呼ばれる
//ジャンプの状態を更新する
function DidJump () {
    jump.jumping = true;    //ジャンプをしているかどうか
    jump.reachedApex = false;   //ジャンプが頂点に達したかどうか
    jump.lastTime = Time.time;  //最後にジャンプをした時間
    jump.lastStartHeight = transform.position.y;    //ジャンプ開始時のY座標(高さ)
}

//物理フレーム毎に呼ばれる関数
//キャラクターの制御を全般的に行う
function FixedUpdate () {

    //ジャンプ入力があり操作が可能なら、ジャンプの操作時間を更新
    if ( inputJump && canControl) {
        jump.lastButtonTime = Time.time;
    }

    //移動情報の更新
    UpdateSmoothedMovementDirection();
	
	//重力の適用
    ApplyGravity ();

    //ジャンプの適用
    ApplyJumping ();
	
    //足元の地面が移動する場合などに対応させる処理
    if (activePlatform != null) {
        //地面の移動に合わせて、キャラクターも移動させる
        var newGlobalPlatformPoint : Vector3 = activePlatform.TransformPoint(activeLocalPlatformPoint); //現在の地面のグローバル座標
        var moveDistance : Vector3 = (newGlobalPlatformPoint - activeGlobalPlatformPoint);  //地面の移動距離を求める
        transform.position = transform.position + moveDistance; //地面が移動した分、キャラクターの座標を移動させる
        lastPlatformVelocity = moveDistance / Time.deltaTime;   //地面の移動速度を求める
    }
    else{
        lastPlatformVelocity = Vector3.zero;    //地面の速度をリセット(0に)する。
    }
	
    activePlatform = null;  //地面のオブジェクトを空(null)にする。
	
    //キャラクター移動させる前に、座標を変数に保持させる
    var lastPosition : Vector3 = transform.position;
	
    //移動量を割り出す
    var currentMovementOffset : Vector3 = movement.direction * movement.speed + new Vector3 (0, movement.verticalSpeed, 0) + movement.inAirVelocity;
	
    //1物理フレーム辺りの移動量に変換する
    currentMovementOffset *= Time.deltaTime;
	
    //キャラクター(CharacterController)を移動させる(戻り値は衝突フラグ)。
    movement.collisionFlags = controller.Move (currentMovementOffset);
	
    //キャラクターの座標の変化から、速度を求める
    movement.velocity = (transform.position - lastPosition) / Time.deltaTime;
	
    //地面と接触している場合に、地面の座標を代入する
    if (activePlatform != null) {
        activeGlobalPlatformPoint = transform.position; //地面のグローバル座標を代入(接触しているキャラクターの座標が使用される)
        activeLocalPlatformPoint = activePlatform.InverseTransformPoint (transform.position);   //地面からみたキャラクターの相対座標を取得し代入する
    }
	
    //移動方向からキャラクターを回転させる
    if (movement.direction.sqrMagnitude > 0.01)
    {
        transform.rotation = Quaternion.Slerp (transform.rotation, Quaternion.LookRotation (movement.direction), Time.deltaTime * movement.rotationSmoothing);  //キャラクターの現在の回転と新しい回転から、滑らかに回転をするように値を調整をして代入する
    }
	
    //キャラクターが地面に接触している
    if (controller.isGrounded) {
        movement.inAirVelocity = Vector3.zero;  //空中の速度を0に
        
        //ジャンプ中ならジャンプの終了処理をする
        if (jump.jumping) { 
	        jump.jumping = false;
	        SendMessage ("DidLand", SendMessageOptions.DontRequireReceiver);    //メッセージを送信する(ゲームオブジェクトに付加されているスクリプトのDidLand関数を呼び出す)

            //移動方向を割り出す
	        var jumpMoveDirection : Vector3 = movement.direction * movement.speed;
	        if (jumpMoveDirection.sqrMagnitude > 0.01){  //移動方向のベクトルの大きさが少しでもあれば
		        movement.direction = jumpMoveDirection.normalized;  //正規化する(大きさを1とする単位ベクトルに変換する)
            }
        }
    }	
}

//CharacterControllerにColliderが衝突したときに自動で呼ばれる
//足もと(地面)のオブジェクトの更新を行なう
function OnControllerColliderHit( hit : ControllerColliderHit )
{
    //接触した方向が上向きなら何もしない
    if (hit.moveDirection.y > 0.01f){
        return;
    }
    	
	//接触した方向が真下辺りなら、足もとの物(地面)を代入する
    if (hit.moveDirection.y < -0.9f && hit.normal.y > 0.9f) {
        activePlatform = hit.collider.transform;    //物(地面)のトランスフォーム コンポーネント(位置や回転、スケール情報を保持する)の参照を代入
    }
}
