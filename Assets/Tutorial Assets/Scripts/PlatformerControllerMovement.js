//使用する名前空間の指定(System.Nonserialized用)
import System;

//キャラクターの移動に関する情報を保持するクラス。
//PlatformCharacterMotor(キャラクター制御)スクリプトが使用する。
class PlatformerControllerMovement
{
    //プロパティ
    public var walkSpeed :float = 3.0f; //歩きの速さ
    public var runSpeed :float = 10.0f; //ダッシュの速さ
    public var inAirControlAcceleration :float = 1.0f;  //空中で移動入力があった際の加速度
    public var gravity :float = 40.0f;  //キャラクターにかかる重力
    public var maxFallSpeed :float = 20.0f; //落下速度の上限
    public var speedSmoothing :float= 5.0f; //キャラクターの速度変動の速さ
    public var rotationSmoothing :float= 30.0f; //キャラクターの回転変動の速さ

    //以下に定義された@NonSerializedはInspectorビューのプロパティに表示せず、値も保存しないもの
    
    @NonSerialized
    var direction :Vector3 = Vector3.zero;  //移動方向

    @NonSerialized
    var verticalSpeed  :float= 0.0f;    //垂直方向の速さ

    @NonSerialized
    var speed :float= 0.0f; //移動の速さ(speedSmoothing変数により調整される)

    @NonSerialized
    var isMoving :boolean = false;  //移動しているかどうか(移動操作があればtrueになる)

    @NonSerialized
    var collisionFlags :CollisionFlags; //衝突状況を示すフラグ(最後に実行したCharacterControllerコンポーネントのMove(移動)関数の戻り値による)

    @NonSerialized
    var velocity : Vector3; //キャラクターの移動速度(キャラクターの座標の変化から計算される)

    @NonSerialized
    var inAirVelocity :Vector3; //キャラクターが空中(非地面)にいる時に加算される速度

    @NonSerialized
    var hangTime :float= 0.0f;  //空中(非地面)にいる時間
}