using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class MMDSkinsScript : MonoBehaviour
{
	// �\��̎��
	public enum SkinType
	{
		Base,
		EyeBrow,
		Eye,
		Lip,
		Other,
	}

	// �S�Ă̒��_�f�[�^����^�[�Q�b�g�ƂȂ钸�_�C���f�b�N�X
	public int[] targetIndices;

	// ���[�t��ւ̃x�N�g��
	public Vector3[] morphTarget;

	// �\��̎��
	public SkinType skinType;

	// �O�t���[���̃E�F�C�g�l
	float prev_weight = 0;

	// Use this for initialization
	void Start () 
	{
		
	}

	// ���[�t�̌v�Z
	public bool Compute(Vector3[] composite)
	{
		bool computed_morph = false;	// �v�Z�������ǂ���

		float weight = transform.localPosition.z;

		if (weight != prev_weight)
		{
			computed_morph = true;
			for (int i = 0; i < targetIndices.Length; i++)
				composite[targetIndices[i]] = morphTarget[i] * weight;
		}

		prev_weight = weight;
		return computed_morph;
	}

	public void Compute(Vector3[] vtxs, int[] indices, Vector3[] source)
	{
		float weight = transform.localPosition.z;

		if (weight != prev_weight)
		{
			for (int i = 0; i < targetIndices.Length; i++)
			{
				//vtxs[targetIndices[i]] += morphTarget[i] * weight * 0.1f;
				vtxs[indices[targetIndices[i]]] = source[targetIndices[i]] + morphTarget[i] * weight * 0.1f;
			}
		}

		prev_weight = weight;
	}
}
