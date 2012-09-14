#pragma strict

var time : float = 4;
var color0 : Color = Color.clear;
var ColorPropertyName : String = "_TintColor";


function Start(){
    gameObject.active = false;

}

function StartFade( fadeColor : Color, messageReceiver : GameObject )
{
    
    gameObject.active = true;
    
    StopCoroutine("Fade");
    StartCoroutine(Fade( fadeColor, messageReceiver));
}

private function Fade( color1 : Color, messageReceiver : GameObject )
{
    var mat : Material = renderer.material;

    //fadein
    var nTime : float = 1 / time;
    var t : float = 0;

    while (t <= 1)
    {
        mat.SetColor(ColorPropertyName, Color.Lerp(color0, color1, t));

        t += nTime * Time.deltaTime;

        yield;
    }

    if (messageReceiver)
    {
        messageReceiver.SendMessage("Fadein", SendMessageOptions.DontRequireReceiver );
    }

    //fadeout
    t = 0;
    while (t <= 1)
    {
        mat.SetColor(ColorPropertyName, Color.Lerp(color1, color0, t));

        t += nTime * Time.deltaTime;

        yield;
    }

    if (messageReceiver)
    {
        messageReceiver.SendMessage("Fadeout", SendMessageOptions.DontRequireReceiver );
    }
    
    gameObject.active = false;
}
