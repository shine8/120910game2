//使用する名前空間の指定(System.Nonserialized用)
import System;

//キャラクターのジャンプに関する情報を保持するクラス。
//PlatformCharacterMotor(キャラクター制御)スクリプトが使用する。
class PlatformerControllerJumping {
    //プロパティ
    public var enabled : boolean = true;    //ジャンプを使用可能にするかどうか
    public var height : float = 2.0f;   //ジャンプの高さ(単位はメートル)

    //以下に定義された@NonSerializedはInspectorビューのプロパティに表示せず、値も保存しないもの

    @NonSerialized
    var repeatTime :float = 0.05f;  //ジャンプの処理直後に連続処理を避けるための時間(単位は秒)

    @NonSerialized
    var timeout :float = 0.15f; //連続でジャンプ操作を有効化させないための時間(単位は秒)

    @NonSerialized
    var jumping :boolean = false;   //ジャンプをしているかどうか
	
    @NonSerialized
    var reachedApex :boolean = false;   //ジャンプが頂点に達したかどうか
  
    @NonSerialized
    var lastButtonTime:float = -10.0f;  //ジャンプボタンが最後に押された時間
	
    @NonSerialized
    var lastTime :float = -1.0f;    //最後にジャンプをした時間

    @NonSerialized
    var lastStartHeight :float= 0.0f;   //ジャンプ開始時のY座標(高さ)
}
