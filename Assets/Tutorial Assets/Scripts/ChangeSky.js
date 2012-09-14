//スカイボックスをフェードイン・フェードアウトで変更するスクリプト(フェード処理はCameraFadeスクリプトに任せる)

//最適化のための定義(負荷の軽減に役立つが、スクリプトの文法チェックが厳しくなる)
#pragma strict

//プロパティ
var fadeColor : Color = Color.black;    //フェードインの色
var skyboxMaterial : Material;  //スカイボックスのマテリアル

//内部で使用する変数
private var skybox : Skybox;        //スカイボックスの参照
private var fade : CameraFade;      //CameraFadeスクリプトコンポーネントの参照

//スクリプトの導入時に一度だけ呼ばれる
//コンポーネントの参照を取得して代入する
function Awake()
{
    skybox = Camera.main.GetComponent( Skybox ) as Skybox;
    fade = Camera.main.GetComponentInChildren( CameraFade ) as CameraFade;
}

//物が衝突し始めた時に呼ばれる関数
//Playerが接触したら、フェードを実行する
function OnTriggerEnter(col : Collider )
{
    //Playerではない場合は何もしない
    if (col.tag != "Player")    //ゲームオブジェクトのタグがPlayerではない
    {
        return;
    }
    
    //変更をするスカイボックスのマテリアルが同じ(変更をする必要がない)
    if( skybox.material == skyboxMaterial ){
        return;
    }
    
    //フェードの実行
    fade.StartFade( fadeColor, this.gameObject );
}


//フェードインの時に呼ばれる関数
//スカイボックスのマテリアルを変更する
function Fadein()
{
    skybox.material = skyboxMaterial;
}

