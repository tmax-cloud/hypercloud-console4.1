# hypercloud-console patch note
## [Product Name]_[major].[minor].[patch].[hotfix]
Version: hypercloud-console_4.1.4.0
2020-09-03  09:24:38 AM
- [feat][patch] 파이프라인 빌더 validation 문구 위치 고정값 수정 (miri_jo) 
    Message: [IMS] 234651

- [bugfix][patch] 태스크런 sample yaml 버그 수정 (miri_jo) 
    Message: [IMS] 235589

- [bugfix][patch] task yaml 사이드바 진행하기, 다운로드 동작하지 않는 버그 수정 (miri_jo) 
    Message: [IMS] 237626

- [feat][patch] 파이프라인 폼에디터 validation 문구 위치 조정 및 텍스트 간 마진 수정 (miri_jo) 
    Message: 
- [feat][patch] ServiceAccount > Create Form > 설명 String 번역 적용 (yeojin_choi) 
    Message: IMS: 235949

- [refactor] [patch] Limit Range, Resource Quota 샘플 yaml 영문 번역 기획 반영 (yeonggyulim) 
    Message: [IMS]: 223807, 224046

- [refactor] [patch] 일부 메시지 영문화 (yeonggyulim) 
    Message: 
- [bugfix] [patch] namespaceClaim과 resourceQuotaClaim 생성 폼 에디터에서 label 입력 시 오류 수정 (yeonggyulim) 
    Message: [IMS]: 236448, 236435

- [refactor] [patch] ResourceQuotaClaim, NamespaceClaim 생성 폼 에디터에 중복 key 있을 때 생성 안되게 수정 (yeonggyulim) 
    Message: 
- [refactor] [patch] ResourceQuota, Namespace, NamespaceClaim, ResourceQuotaClaim 생성 폼 에디터 required 인풋에 대한 입력 validation 추가 (yeonggyulim) 
    Message: [IMS]: 236444

- [refactor] [patch] Limit Range, Resource Quota 샘플 yaml 영문 번역 기획 반영 (jinsoo_youn) 
    Message: [IMS]: 223807, 224046

- [refactor] [patch] 일부 메시지 영문화 (jinsoo_youn) 
    Message: 
- [bugfix] [patch] namespaceClaim과 resourceQuotaClaim 생성 폼 에디터에서 label 입력 시 오류 수정 (jinsoo_youn) 
    Message: [IMS]: 236448, 236435

- [refactor] [patch] ResourceQuotaClaim, NamespaceClaim 생성 폼 에디터에 중복 key 있을 때 생성 안되게 수정 (jinsoo_youn) 
    Message: 
- [refactor] [patch] ResourceQuota, Namespace, NamespaceClaim, ResourceQuotaClaim 생성 폼 에디터 required 인풋에 대한 입력 validation 추가 (jinsoo_youn) 
    Message: [IMS]: 236444

- [feat][patch] 파이프라인 컨디션 리스트 페이지 칼럼 간 간격 수정 (miri_jo) 
    Message: [IMS] 235905

- [bugfix][patch] Role 메뉴 - cluster role 삭제 후, 제거된 cluster role list 페이지로 이동하는 버그 수정 (yeojin_choi) 
    Message: IMS: 233435

- [refactor] [patch] ResourceQuotaClaim 리스트 페이지에 필터링 기능 추가 (yeonggyu_lim) 
    Message: [IMS]: 237605

- [refactor] [patch] NamespaceClaim 생성 폼 에디터에 CPU Liomits와 Memory Limits는 필수 값으로 변경 (yeonggyulim) 
    Message: 
- [refactor] [patch] ResourceQuotaClaim 생성 폼 에디터에 CPU Liomits와 Memory Limits는 필수 값으로 변경 (yeonggyulim) 
    Message: 
- [refactor] [patch] Workload > Pod sample yaml 수정 (yeonggyulim) 
    Message: [IMS]: 233579

- [refactor] [patch] Workload > Pod sample yaml 수정 (yeonggyulim) 
    Message: [IMS]: 233579

- [refactor] [patch] NamespaceClaim, ResourceQuotaClaim 생성 폼 에디터에 리소스 할당량 required 표시 추가 (yeonggyulim) 
    Message: 
- [refactor] [patch] LimitRange 생성 폼 에디터 새로운 기획에 맞게 수정 (yeonggyulim) 
    Message: 
- [feat][patch] hyperflow (kubeflow)에 websocket proxy 연동과 주소 오류 수정 (jinsoo_youn) 
    Message: 
- [feat][patch] 파이프라인 승인 번역 추가 (miri_jo) 
    Message: [IMS] 236522

- [bugfix][patch] ConfigMap, CronJob, Role - YamlEditor Sample String 변경사항 반영 (yeojin_choi) 
    Message: IMS: 224434, 224441, 224682

- [feat][patch] 클러스터 오버뷰 페이지에 번역 적용 (miri_jo) 
    Message: 
- [feat][patch] audit 페이지 번역 추가 (miri_jo) 
    Message: 
- [feat][bugfix][patch] hyperflow 한정 header의 blacklist에 cookie 차단 기능 해제 [IMS] 238193 cookie 차단으로 파일 업로드 시 reverse proxy 안되는 형상이 발생함 (jinsoo_youn) 
    Message: 
- [feat][patch] 태스크 런 폼에디터 번역 추가 (miri_jo) 
    Message: [IMS] 236694

- [feat][patch] Role, RoleBindingClaim Form Editor 설명 String 적용 (yeojin_choi) 
    Message: IMS: 238257

- [refactor] [patch] Registry 생성 폼 에디터 placeholder 수정 (yeonggyulim) 
    Message: [IMS]: 237963

- [refactor] [patch] Limit Range 폼 에디터를 Pod, Container, PVC 3가지 각각의 기능에 맞는 새로운 기획의 폼으로 수정 (yeonggyulim) 
    Message: 
- [refactor] [patch] 번역 오류 수정 (permanent => persistent) (yeonggyulim) 
    Message: [IMS]: 237771

- [feat][patch] 브라우저 언어 세팅에 따라 초기 언어값 설정되도록 수정 (이경준) 
    Message: 
- [refactor] [patch] Limit Rnage, Resource Quota 필수 입력값 체크 추가 (yeonggyulim) 
    Message: [IMS]: 236444

- [bugfix][patch] Pod Security Policy - Yaml Editor Sidebar yaml 컨텐츠 수정 (심소영) 
    Message: [IMS] 224782

- [bugfix][patch] 서비스 생성 - Yaml Sample Sidebar 4번 항목 추가, yaml 코드 수정 (심소영) 
    Message: [IMS] 223790

- [bugfix][patch] ingress Yaml Editor Sidebar영문 컨텐츠 번역 추가, sample yaml 코드 변경, 2번 제목 내용 순서 변경 (심소영) 
    Message: [IMS] 223789

- [bugfix][patch] 서비스 인스턴스 - 생성 화면 리사이징 시 카드 글씨 정렬 안맞는 버그 수정 (심소영) 
    Message: [IMS] 236374

- [bugfix][patch] pvc yaml editor sample - 4번 항목 컨텐츠 수정 (심소영) 
    Message: [IMS] 224866

- [feat][patch] 태스크 런, 파이프라인 런, 파이프라인 리소스 폼에디터 상단의 description 추가 (miri_jo) 
    Message: [IMS] 238257
