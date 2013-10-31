//----------------------------------------------------------------------------
// RAMFOS
// �������� �������� ���
//
// 2013-11-01 ����������� vinxru
//----------------------------------------------------------------------------

// ���������

unmlzOffset	= 0x0063;
ramfosOffset	= 0x0430;
romdiskOffset	= 0x1800;
romdiskSize	= 0x10000-0x1800-11; // -romdiskOffset - page0start.length - page0end.length
loader1Offset	= 0x8000;

// ����������� ������

fso = new ActiveXObject("Scripting.FileSystemObject");
shell = new ActiveXObject("WScript.Shell");
function kill(name) { if(fso.FileExists(name)) fso.DeleteFile(name); }
function fileSize(name) { return fso.GetFile(name).Size; }
function loadAll(name) { return fso.OpenTextFile(name, 1, false, 0).Read(fileSize(name)); } // File.LoadAll ������ 
function exec(cmd) { if(shell.Run(cmd, 2, true)) throw cmd; }
src = loadAll("tbl.bin"); decode = []; encode = []; for(i=0; i<256; i++) { decode[src.charCodeAt(i)] = i; encode[i] = src.charAt(i); }

// �������������� BIN->INC

function bin2inc(src, dest, x) {
  abc = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F' ];
  src = loadAll(src); 
  s = "";
  pos = 0;
  for(i=0; i<src.length; i++) {
    if((i%x)!=0) s += ","; else { if(i!=0) s += " ; "+(pos++)+"\r\n"; s += "	.db "; }
    v = decode[src.charCodeAt(i)];
    s += '0' + abc[v>>4] + abc[v&0xF] + 'h';
  }
  fso.CreateTextFile(dest, true).Write(s);
}

// ������� �����, ��� �� � ������ ������ �� �� ����

function killTmpFiles() {
  kill("loader1.lst");
  kill("loader1.bin");
  kill("loader1.mlz");
  kill("loader1.inc");
  kill("loader0.lst");
  kill("loader0.bin");
  kill("ramfos.bin");
  kill("ramfos.mlz");
}
killTmpFiles();
kill("SpecialistMX2.bin");

// ��������� �� ������� ��������

page0start = encode[0xC3] + encode[0xF8] + encode[0x7F]; // jmp 07FF8h
page0end   = encode[0x3E] + encode[0xC7];		 // mvi	a, "rst 0"
page0end  += encode[0x32] + encode[0x00] + encode[0x80]; // sta 08000h
page0end  += encode[0x32] + encode[0xFE] + encode[0xF7]; // sta	0F7FEh

// ���������� ����������

exec("tasm -gb -b -85 loader1.asm loader1.bin");
exec("megalz loader1.bin loader1.mlz");
bin2inc("loader1.mlz", "loader1.inc", 16);
exec("tasm -gb -b -85 loader0.asm loader0.bin");

// �������� ������ ����� �� ������ RAMFOS

src = loadAll("ramfos/ramfos.bin");
offset = 0xC000;
end1   = 0xD2A0 - offset;
start2 = 0xF800 - offset;
end2   = 0xFFE0 - offset;
fso.CreateTextFile("ramfos.bin", true).Write(src.substr(0, end1) + src.substr(start2, end2 - start2));

// ������� ���

exec("megalz ramfos.bin ramfos.mlz");

// ������� ����

byte0 = encode[0];

// �������� �����

// ������ ��������
romdisk = loadAll("romdisk.bin");
dest = page0start;
dest += romdisk.substr(32768-romdiskOffset, 32768-page0start.length-page0end.length);
while(dest.length < 0x8000-page0end.length) dest += byte0;
dest += page0end;

// ������ ��������
dest += loadAll("loader0.bin");
if(dest.length > 0x8000+ramfosOffset) throw "ramfosOffset";
while(dest.length < 0x8000+ramfosOffset) dest += byte0;
dest += loadAll("ramfos.mlz");
if(dest.length > 0x8000+romdiskOffset) throw "romdiskOffset";
while(dest.length < 0x8000+romdiskOffset) dest += byte0;
dest += romdisk.substr(0, 32768-romdiskOffset);
while(dest.length < 0x10000) dest += byte0;

// ���������
fso.CreateTextFile("SpecialistMX2.bin", true).Write(dest);

// �������� � ��������
fso.GetFile("SpecialistMX2.bin").Copy("C:/emu/Specialist/specsvga.bin", true); 

// ������ ��������� �����
killTmpFiles();