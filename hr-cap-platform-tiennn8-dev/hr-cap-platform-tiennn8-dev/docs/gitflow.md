# GitLab Flow
GitLab Flow is a compromise between GitFlow and GitHub Flow, adding environment branches and release branches to the simplicity of GitHub Flow.

## Structure

- Main branch:
main: Integration branch that's always ready for deployment

- Environment branches:
production, staging, pre-production: Represent deployed environments

- Feature branches:
Created from main for any new work

```
main        -> Production
develop     -> Dev integration
feature/*   -> Feature development
release/*   -> Chuẩn bị release QAS
hotfix/*    -> Fix production
```

## Workflow

1. Create feature branches from main
2. Merge feature branches back to main via merge requests
3. Changes flow from main to environment branches as they're ready
4. For versioned software, create release branches when ready

## Flow hoạt động
1️⃣ Dev phát triển feature
feature/employee-api
feature/payroll-ui

Branch từ develop.

feature/*  -> merge request -> develop

Deploy:
```
develop -> BTP DEV
```
2️⃣ Chuẩn bị release

Khi DEV stable:
```
develop -> release/1.0
```
Deploy:
```
release/1.0 -> BTP QAS
```
QA test trên QAS.

3️⃣ Release Production

Sau khi QAS OK:
```
release/1.0 -> main
```
Deploy:
```
main -> BTP PROD
```
Sau đó merge ngược:

main -> develop
4️⃣ Hotfix Production

Nếu PROD lỗi:
```
hotfix/login-bug
```
Branch từ main.

Fix xong:
```
hotfix -> main
hotfix -> develop
```
Deploy:
```
main -> PROD
```
## Ref
https://dev.to/karmpatel/git-branching-strategies-a-comprehensive-guide-24kh