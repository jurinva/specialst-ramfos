printFileHeaderLight:
		; ���� ������� ������ �������, �� ���� ����� �������� �����. 

		; ��������
		mvi	a, C_INVERSE
		call	j_printCharA

printFileHeaderDark:
		; ������� �������� ��������� ������� ������, �� �� ����������� ���
		; ������� �� ����� ��� �����
		; ����� ������ ����� ������� ��������� ������ ���
		call	printFileHeaderName2

popCursorLine2:	; ������������ ������ ������
		mvi	a, C_POPCURSORL
		jmp	j_printCharA

; ---------------------------------------------------------------------------
; ������� �������� ��������� ������� ������, �� �� ����������� ���
; ������� �� ����� ��� �����
; ����� ������ ����� ������� ��������� ������ ���

printFileHeaderName2:
		call	pushCursorLine2
		call	j_getCursorPos
		xchg

printFileHeaderName:
		mvi	c, 12
		lxi	h, v_header_name
printFileHeaderName_0:
		 mov	a, m
		 inx	h
		 call	j_printCharA
		 dcr	c
		jnz	printFileHeaderName_0

		; ��������� ������� ����
		mvi	a, C_NORMAL
		jmp	j_printCharA