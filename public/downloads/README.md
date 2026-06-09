# 앱 다운로드 (Melody Breeze)

- 파일: `melody-breeze.apk` (~215MB, debug 빌드)
- **Git 저장소에는 포함하지 않음** (GitHub 100MB 제한)
- 배포: [GitHub Releases](https://github.com/mandur23/Portfolio-Nano-/releases)에 APK 업로드

## Release에 APK 올리기

```powershell
# 1. APK 복사 (Android 프로젝트에서 빌드 후)
Copy-Item "C:\Users\User\AndroidStudioProjects\-_-\app\build\outputs\apk\debug\app-debug.apk" `
  "public\downloads\melody-breeze.apk" -Force

# 2. GitHub Release 생성 + APK 첨부 (gh CLI)
gh release create v1.1.2 public/downloads/melody-breeze.apk `
  --repo mandur23/Portfolio-Nano- `
  --title "v1.1.2" `
  --notes "Melody Breeze APK"
```

사이트의 다운로드 링크는 `releases/latest/download/melody-breeze.apk`를 사용합니다.

## APK 갱신 시

1. 위처럼 APK를 이 폴더에 복사
2. 새 태그로 `gh release create v1.x.x ...` 실행
3. `src/data/projects.ts`의 버전은 `latest` URL이라 보통 수정 불필요
