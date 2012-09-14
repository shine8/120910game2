//BGMの領域(Collider)にPlayerが出入りしたときに、フェードを用いてBGMの再生・停止を行なうスクリプト

//このスクリプトが必要とするコンポーネント(自動でコンポーネントとして付加される)
@script RequireComponent(AudioSource)
@script RequireComponent(BoxCollider)

//プロパティ
//フェードインとフェードアウトにかける時間
public var _FadeInTime :float = 3;
public var _FadeOutTime :float = 3;

//内部で使用する変数
private var _AudioSource :AudioSource;  //AudioSourceコンポーネントへの参照

//スクリプトの初期導入時に一度だけ呼ばれる
//コンポーネントの参照の取得と代入
function Awake()
{
    _AudioSource = GetComponent(AudioSource);
}

//BGMをフェードインで再生する
//物(コライダ)がぶつかり始めた時に呼ばれる
function OnTriggerEnter( col : Collider )
{
    //接触したのがPlayer以外なら何もしない
    if( col.name != "Player" ){
        return;
    }

    //フェードインのコルーチン(継続して自動で実行し続ける)を(再)実行する。
    StopAllCoroutines();
    StartCoroutine(FadeIn(_FadeInTime));
}

//BGMをフェードアウトで停止する
//ぶつかっていた物(コライダ)が離れた時に呼ばれる
function OnTriggerExit( col :Collider)
{
    //接触したのがPlayer以外なら何もしない
    if( col.name != "Player" ){
        return;
    }

    //フェードアウトのコルーチン(継続して自動で実行し続ける)を(再)実行する。
    StopAllCoroutines();
    StartCoroutine(FadeOut(_FadeOutTime));

}

//BGMをフェードインする(コルーチン)
//timeはフェードに要する時間
private function FadeIn( time :float )
{
    _AudioSource.Play();
    var e:IEnumerator = Fade(0, 1, time);  //フェード関数を呼んで、反復処理の参照を取得する
    
    //フェードが終わるまで、毎フレーム反復処理を実行し続ける。
    while (e.MoveNext())    //反復処理を一回実行する。続きがある場合はtrueが返る。
    {
        yield e.Current;
    }
}

//BGMをフェードアウトする(コルーチン)
//引数のtimeはフェードに要する時間
//最後にBGMを停止する
private function FadeOut(time :float )
{
    var e:IEnumerator = Fade( 1, 0, time);  //フェード関数を呼んで、反復処理の参照を取得する

    //フェードが終わるまで、毎フレーム反復処理を実行し続ける。
    while (e.MoveNext())    //反復処理を一回実行する。続きがある場合はtrueが返る。
    {
        yield e.Current;
    }
    _AudioSource.Stop();    //停止
}


//一定時間(time秒)をかけて、音量を調整する(fromValumeからtoVolumeへ)
private function Fade( fromVolume :float, toVolume :float, time :float)
{
    var timeRatio :float = 1 / time;    //一定時間(time秒)が経過したときに、1を返すための係数を算出する
    var nTime :float = 0;   //経過時間。time秒が経ったら1になる
    
    //経過時間になるまで毎フレーム繰り返す
    while (nTime <= 1.0)
    {
        nTime += timeRatio * Time.deltaTime;    //1フレームの経過時間を(係数で掛けて)加える
        _AudioSource.volume = Mathf.Lerp(fromVolume, toVolume, nTime);  //音量を変更する。Mathf.Lerp関数は、時間に対応する引数(nTime)が0以下で最小値、1以上で最大値を返す。また、0~1の間の値も計算される。
        yield true; //1フレーム待機
    }
}

