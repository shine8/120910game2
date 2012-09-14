using UnityEngine;
using System.Collections;
 
public class ClickMoving : MonoBehaviour
{
	public GameObject obj;
 	public float offsetY;
	private void Update()
	{
		//Touch touch = Input.GetTouch(0);
		if (Input.GetMouseButtonDown(0))
		{
			Vector2 point=Input.mousePosition;
			RaycastHit hit =new RaycastHit();
			Ray ray = Camera.main.ScreenPointToRay(point);
			if(Camera.main == null)
			{
				ray=Camera.current.ScreenPointToRay(point);
			}
			if(Physics.Raycast(ray,out hit) )
			{
				obj.transform.position = new Vector3(hit.point.x, hit.point.y + offsetY, hit.point.z);
			}
			
		}
	}
}