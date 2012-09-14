//足音を鳴らすためのスクリプト

//このスクリプトが必要とするコンポーネント(無いときは一緒に付加される)。
@script RequireComponent(CharacterController)
@script RequireComponent(AudioSource)

//プロパティ
public var playInterval : float = 0.5;  //連続で足音が再生されるまでに必要な間隔(秒)

private var nextPlayTime : float = 0;   //次に足音を再生できる時間(連続再生を防止する)

//地面(素材)ごとの音声(オーディオクリップ)
public var otherClips : AudioClip[];    //その他
public var woodClips : AudioClip[]; //木
public var dirtClips : AudioClip[]; //土

//コンポーネントの参照
private var controller : CharacterController;
private var audioSource : AudioSource;

//スクリプトの導入時に一度だけ呼ばれる
function Awake()
{
    //コンポーネントの参照を代入
    controller = GetComponent(CharacterController);
    audioSource = GetComponent(AudioSource);
}

//毎フレーム呼ばれる
//動いていたら足音を鳴らす
function Update ()
{
    //一定の間隔を置いたら再生
	if( Time.time >= nextPlayTime )
	{
	    //キャラクターが地面に接触していて、止まっていない場合に足音を鳴らす。
        if( controller.isGrounded && controller.velocity != Vector3.zero ){
    		nextPlayTime = Time.time + playInterval;    //足音が鳴り続けないように、一定の間隔を置くための時間を更新
    		OnFootStrike(); //足音を鳴らす
        }
	}	
}

//足音を鳴らす
function OnFootStrike()
{
    var volume : float = Mathf.Clamp01(0.1 + controller.velocity.magnitude * 0.3);  //音量をキャラクターの速度から0~1の間で算出する
    var clip : AudioClip = GetAudioClip();  //再生するオーディオクリップを取得
    
    audioSource.PlayOneShot( clip, volume );    //再生
}

//Playerの地面に応じたオーディオクリップの取得
function GetAudioClip() : AudioClip
{
    var clip : AudioClip;
    var tag : String = null;    //地面のタグ

    var hit : RaycastHit;
 	if( Physics.Raycast(transform.position + new Vector3(0, 0.5, 0), -Vector3.up, hit) )   //足もとに衝突検知のためのレイ(光線)を飛ばす
	{
		tag = hit.collider.tag; //衝突した地面のタグを代入
		
	}
	
	//タグによってオーディオクリップを代入する	
	if( tag == "Wood" ) //地面のタグが木なら
	{
		clip = woodClips[Random.Range(0, woodClips.length)];    //プロパティからランダム(無作為)に一つ取得する
	}
	else if( tag == "Dirt") //地面のタグが土なら
	{
		clip = dirtClips[Random.Range(0, dirtClips.length)];    //プロパティからランダム(無作為)に一つ取得する
	}
	else    //その他
	{
		clip = otherClips[Random.Range(0, otherClips.length)];  //プロパティからランダム(無作為)に一つ取得する
	}
	
	return clip;
}