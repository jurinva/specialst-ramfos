;+---------------------------------------------------------------------------
; RAMFOS + ���������� MX2
; ���������
;
; 2013-11-01 ����������������� vinxru
;----------------------------------------------------------------------------

.org 0                      
		jmp	loader
.org 8000h - 8
loader:
		mvi	a, 0C7h	; RST0
		sta	08000h
		sta	0F7FEh

#if $ != 8000h
������
#endif
		; RST 0
.end