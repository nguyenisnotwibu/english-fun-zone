$ErrorActionPreference='Continue'
$dir = 'D:\claude project\english-567'
$h = Get-Content -Raw -Encoding UTF8 (Join-Path $dir 'index.html')
$m = [regex]::Match($h, '(?s)<script>(.*)</script>')
[IO.File]::WriteAllText((Join-Path $dir 'app.test.js'), $m.Groups[1].Value, [Text.Encoding]::UTF8)
$out = & node --check (Join-Path $dir 'app.test.js') 2>&1
if ($LASTEXITCODE -eq 0) { $res = 'JS_OK script_len=' + $m.Groups[1].Value.Length } else { $res = "JS_ERROR`n" + ($out | Out-String) }
[IO.File]::WriteAllText((Join-Path $dir 'check_result.txt'), $res, [Text.Encoding]::UTF8)
