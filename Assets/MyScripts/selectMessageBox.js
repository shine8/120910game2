#pragma strict

function Start () {

}

function Update () {

}
var scrollViewVector :
Vector2 = Vector2.zero;

var skin : GUISkin;

var boxText :
	String = "I am inside the ScrollView";
// The variable to control where the scrollview 'looks' into its child elements.
var scrollPosition : Vector2;

// The string to display inside the scrollview. 2 buttons below add & clear this string.
var longString = "This is a long-ish string";

function OnGUI(){
	GUI.Box (Rect (0,0,160,100), "  ");
	GUI.skin=skin;
	/*
	scrollViewVector = GUI.BeginScrollView (Rect (10, 10, 200, 100), scrollViewVector, Rect (0, 0, 400, 400)); 
	GUI.Label (Rect (10, 10, 300, 20), "MassageBox");
	GUI.Label (Rect (10, 30, 300, 20), boxText);
	GUI.EndScrollView();
	*/
    //GUILayout.BeginArea(Rect(10, 10, 200, 100));
    //GUILayout.BeginVertical();
	//scrollViewVector = GUILayout.BeginScrollView ( scrollViewVector, GUILayout.Width (400), GUILayout.Height (400)); 
	//GUILayout.Label ("MassageBox");
	//GUILayout.Label (boxText);
    //GUILayout.EndVertical();
    //GUILayout.EndArea();
	//GUI.EndScrollView();
	
    // Begin a scroll view. All rects are calculated automatically - 
    // it will use up any available screen space and make sure contents flow correctly.
    // This is kept small with the last two parameters to force scrollbars to appear.
    scrollPosition = GUILayout.BeginScrollView (
        scrollPosition, GUILayout.Width (160), GUILayout.Height (100));
    
    // We just add a single label to go inside the scroll view. Note how the
    // scrollbars will work correctly with wordwrap.
    GUILayout.Label (boxText);
    
    // Add a button to clear the string. This is inside the scroll area, so it
    // will be scrolled as well. Note how the button becomes narrower to make room
    // for the vertical scrollbar
    //if (GUILayout.Button ("Clear"))
    //    boxText = "";
    
    // End the scrollview we began above.
    GUILayout.EndScrollView ();
    
    // Now we add a button outside the scrollview - this will be shown below
    // the scrolling area.
    //if (GUILayout.Button ("Add More Text"))
    //    longString += "\nHere is another line";
    if (GUI.Button (Rect (20, 120, 80, 20),"Clear"))
        boxText = "";
	
}

function UpdateText(text:String){
	boxText+="\n" + text;
}