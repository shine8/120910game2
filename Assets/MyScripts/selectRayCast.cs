using UnityEngine;
using System.Collections;

public class selectRayCast : MonoBehaviour {

	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
		CheckTouch();
	}
	
	protected virtual void CheckTouch()
	{
		if(Input.touchCount <=0 )
		{
			//print("return");
			return;	
		}
		Touch touch = Input.GetTouch(0);
		if( touch.phase == TouchPhase.Began || 
			Input.GetButtonDown("Fire1"))
		{
			//print("----");
			Vector2 point=touch.position;
			RaycastHit hit =new RaycastHit();
			Ray ray = Camera.main.ScreenPointToRay(point);
			if(Camera.main == null)
			{
				ray=Camera.current.ScreenPointToRay(point);
			}
			if(Physics.Raycast(ray,out hit) )
			{
				hit.transform.gameObject.SendMessage("OnMouseDown");
			}
		}
	}
}
