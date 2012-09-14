#pragma strict
private var motor : CharacterMotor;

function Awake () {
	motor = GetComponent(CharacterMotor);
}
function Start () {

}

var target:GameObject;
var closeDistance = 2.0;
var moveSpeed = 0.2;
function Update () {

	if(target){
		var vec:Vector3;
		vec.x=-(transform.position.x-target.transform.position.x);
		vec.z=-(transform.position.z-target.transform.position.z);
		if(vec.sqrMagnitude > closeDistance)
		{
			//print("target");
			vec.Normalize();
			//motor.inputMoveDirection = transform.rotation * vec;
			transform.position+=vec*moveSpeed;
		}
		//vec
		//(transform.position-target.transform.position);
	}

}