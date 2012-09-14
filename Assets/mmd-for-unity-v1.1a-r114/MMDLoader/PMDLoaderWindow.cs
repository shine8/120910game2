#if UNITY_EDITOR
using UnityEngine;
using System.Collections;
using UnityEditor;
using MMD.PMD;

public class PMDLoaderWindow : EditorWindow {
	Object pmdFile = null;
	bool cutoutFlag = true;
	bool rigidFlag = true;
	ShaderType shader_type = ShaderType.MMDShader;

	[MenuItem ("Plugins/MMD Loader/PMD Loader")]
	static void Init() {
		var window = (PMDLoaderWindow)EditorWindow.GetWindow<PMDLoaderWindow>(true, "PMDLoader");
		window.Show();
	}
	
	void OnGUI() {
		const int height = 20;
		int width = (int)position.width - 16;
		
		pmdFile = EditorGUI.ObjectField(
			new Rect(0, 0, width, height), "PMD File" ,pmdFile, typeof(Object));
		
		// シェーダの種類
		shader_type = (ShaderType)EditorGUI.EnumPopup(new Rect(0, height, width, height), "Shader Type", shader_type);

		// 剛体を入れるかどうか
		rigidFlag = EditorGUI.Toggle(new Rect(0, height * 2, width / 2, height), "Rigidbody", rigidFlag);

		int buttonHeight = height * 3;
		if (pmdFile != null) {
			if (GUI.Button(new Rect(0, buttonHeight, width / 2, height), "Convert")) {
				PMDLoaderScript pmdLoader = new PMDLoaderScript(pmdFile, shader_type, rigidFlag);
				pmdFile = null;		// 読み終わったので空にする 
			}
		} else {
			EditorGUI.LabelField(new Rect(0, buttonHeight, width, height), "Missing", "Select PMD File");
		}
	}
}
#endif