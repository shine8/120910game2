//プレイヤーの操作を受け付けて、キャラクター制御スクリプト(PlatformCharacterMotor)に通知するスクリプト

//最適化の為の定義(負荷の軽減に役立つが、スクリプトの文法チェックが厳しくなる)
#pragma strict

//このスクリプトが必要とするコンポーネント(無いときは一緒に付加される)
@script RequireComponent(PlatformCharacterMotor)

//内部で使用する変数
private var motor : PlatformCharacterMotor; //キャラクター制御スクリプト コンポーネントへの参照

//スクリプトが導入されたときに一度だけ呼ばれる
//コンポーネントの参照を取得と代入
function Awake() {
	motor = GetComponent(PlatformCharacterMotor) as PlatformCharacterMotor; //キャラクタ制御スクリプト コンポーネントを取得して、フィールド(メンバ変数)に代入
}

//毎フレーム呼ばれる
//入力操作の取得と代入
function Update() {

	var directionVector : Vector3 = new Vector3(Input.GetAxis("Horizontal"), 0, Input.GetAxis("Vertical")); //移動の操作を受け取って、ベクトルに代入する。

    //キャラクター制御スクリプトに操作情報を代入
	motor.inputMove = directionVector;  //移動操作の代入
	motor.inputJump = Input.GetButtonDown("Jump");  //ジャンプ操作を取得して代入
    motor.inputRun = Input.GetAxis("Fire2");    //ダッシュ操作を取得して代入
}

