;----------------------------------------------------------------------------
; RAMFOS
; ������ ������ 15 ���� ��������� ����� � v_header � ����� ��� �� �����
; ����� ������ ����� ���� (������ 2 �����) � DE
;
; 2013-11-01 ����������������� vinxru
;----------------------------------------------------------------------------

tapeReadHeader:	lxi	h, v_header
		call	tapeReadH_1

		; ����� �� ���������������!

		; ������ 15 ���� � ����������� �� ������ hl
		mvi	e, 15
tapeReadH_0:	 call	j_tapeRead
		 mov	m, a
		 inx	h
		 dcr	e
		jnz	tapeReadH_0

		; ������� ��� �� �����
		call	printFileHeaderName

tapeReadH_1:	; ���� ����� ���
		call	j_tapeReadPilot

		; ������ ����� � DE
		cnc	j_tapeRead
		mov	e, a
		cnc	j_tapeRead
		mov	d, a
		ret