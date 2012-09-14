#pragma strict

function Start () {

}

function Update () {

}


var text:
String="This is pen";
function OnMouseDown(){
	print("OnMouseDown object is "+name);
	var obj1 : GameObject = GameObject.FindWithTag("Cursor");
	obj1.transform.position.x=transform.position.x;
	obj1.transform.position.z=transform.position.z;
	var obj2 : GameObject = GameObject.Find("UIControll");
	//var text:String;
	//var head:String="OnMouseDown object is ";
	
	//text=head + name;
	obj2.SendMessage("UpdateText",text);
}