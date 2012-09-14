//キャラクターのアニメーションを制御するスクリプト

//最適化の為の定義(負荷の軽減に役立つが、スクリプトの文法チェックが厳しくなる)
#pragma strict

//このスクリプトが必要とするコンポーネント(無いときは一緒に付加される)
@script RequireComponent(PlatformCharacterMotor)
@script RequireComponent(CharacterController)

//アニメーションの種類の列挙
enum PlatformCharacterAnimationState {
	Idle = 0,   //アイドル(待機)
	Walking = 1,    //歩き
	Running = 2,    //走り
	Jumping = 3,    //ジャンプ
	Falling = 4,    //ジャンプからの落下
}

//プロパティ
public var _Animation : Animation;  //アニメーション コンポーネントの参照
public var idleAnimation : AnimationClip;   //アイドルのアニメーションクリップの参照
public var walkAnimation : AnimationClip;   //歩きのアニメーションクリップの参照
public var runAnimation : AnimationClip;    //ダッシュのアニメーションクリップの参照
public var jumpPoseAnimation : AnimationClip;   //アイドルアニメーションクリップの参照
public var walkMaxAnimationSpeed : float = 0.75;    //歩きアニメーションの最大速度
public var runMaxAnimationSpeed : float = 1.0;  //ダッシュアニメーションの最大速度
public var jumpAnimationSpeed : float = 1.15;   //ジャンプ(上昇時)アニメーションの速度
public var landAnimationSpeed : float = 1.0;    //落下時のアニメーションの速度

//内部で使用する変数
private var characterMotor : PlatformCharacterMotor;    //キャラクター制御スクリプト コンポーネントの参照
private var characterController : CharacterController;  //CharacterControllerコンポーネントの参照
private var state : PlatformCharacterAnimationState;    //キャラクター制御スクリプト コンポーネントの参照

//スクリプトの導入時に一度だけ呼ばれる関数
function Awake(){

    //コンポーネントの取得と代入
    characterController = GetComponent( CharacterController) as CharacterController;
    characterMotor = GetComponent( PlatformCharacterMotor ) as PlatformCharacterMotor;
}

//アニメーションの状態(state)の確認と切り替え
function CheckState(){

    //ジャンプの状態で落下しているなら、落下の状態に切り替える。
    if(state == PlatformCharacterAnimationState.Jumping ){
        if( characterController.velocity.y < 0 ){
            return PlatformCharacterAnimationState.Falling;
        }
        else{
            return state;
        }
    }   
    
    //ジャンプで落下中(着地の関数が呼ばれるまで落下の状態のまま)
    if( state == PlatformCharacterAnimationState.Falling ){
        return state;
    }

    var inputRatio: float = characterMotor.inputMove.sqrMagnitude;  //移動操作の度合いを求める。
    
    //移動操作の入力が小さい場合は、アイドルの状態にする。
    if( inputRatio < 0.1f ){
        return PlatformCharacterAnimationState.Idle;
    }

    //ダッシュの操作をしていたら、ダッシュの状態にする
    if( characterMotor.inputRun != 0 ){
        return PlatformCharacterAnimationState.Running;
    }

    //その他は歩きの状態にする
    return PlatformCharacterAnimationState.Walking;
    
}

//ジャンプをした時に、キャラクター制御スクリプトから呼ばれる関数
function DidJump(){
    state = PlatformCharacterAnimationState.Jumping;    //ジャンプの状態にする
}

//着地をした時に、キャラクター制御スクリプトから呼ばれる関数
function DidLand(){
    state = PlatformCharacterAnimationState.Idle;   //アイドルの状態にする
}

//毎フレーム呼ばれる
//キャラクターの状態に応じてアニメーションを切り替える
function Update(){

    //アニメーションの状態を確認・更新する
    state = CheckState();

    //アニメーションのプロパティが指定されている場合に実行
    //アニメーションは(クロス)フェードで自然にみえるように再生する
	if(_Animation) {    
	
		if( state == PlatformCharacterAnimationState.Falling )  //落下中
		{
		    //落下アニメーションのセッティング
		    _Animation[jumpPoseAnimation.name].speed = -landAnimationSpeed; //落下のアニメーション速度を代入する(マイナスの値で逆再生となる)
			_Animation[jumpPoseAnimation.name].wrapMode = WrapMode.ClampForever;    //アニメーションの最後の状態(姿勢)を保つ指定
			_Animation.CrossFade(jumpPoseAnimation.name);   //(クロス)フェードで自然にみえるように再生する
		}
		else if(state == PlatformCharacterAnimationState.Jumping)   //ジャンプ(上昇)中
		{
		    //落下アニメーションのセッティング
			_Animation[jumpPoseAnimation.name].speed = jumpAnimationSpeed;  //ジャンプのアニメーション速度を代入する
			_Animation[jumpPoseAnimation.name].wrapMode = WrapMode.ClampForever;    //アニメーションの最後の状態(姿勢)を保つ指定
			_Animation.CrossFade(jumpPoseAnimation.name);
		} 
		else if(state == PlatformCharacterAnimationState.Idle) {    //アイドル(待機中)
			_Animation.CrossFade(idleAnimation.name);
		}
		else 
		{
			if(state == PlatformCharacterAnimationState.Running) {  //ダッシュ中
				_Animation[runAnimation.name].speed = Mathf.Clamp(characterController.velocity.magnitude, 0.0, runMaxAnimationSpeed);   //現在のCharacterControllerの速度と最大のダッシュ速度の範囲から、アニメーションの速度を割り出して代入
				_Animation.CrossFade(runAnimation.name);	
			}
			else{
				_Animation[walkAnimation.name].speed = Mathf.Clamp(characterController.velocity.magnitude, 0.0, walkMaxAnimationSpeed);   //現在のCharacterControllerの速度と最大の歩行速度の範囲から、アニメーションの速度を割り出して代入
				_Animation.CrossFade(walkAnimation.name);	
			}
			
		}
	}

}
