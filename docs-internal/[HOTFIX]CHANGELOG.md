# hypercloud-console patch note
## [Product Name]_[major].[minor].[patch].[hotfix]
Version: hypercloud-console_4.1.4.1
2020-09-09  09:53:45 AM
- [feat][patch] Deployment - Form Editor 설명 String 번역 적용 (yeojin_choi) 
    Message: IMS: 238257

- [bugfix] [patch] 여러 항목을 입력하는 폼이 있는 에디터에서 글자 입력후 enter 입력 시에 제거되는 현상 수정 (yeonggyulim) 
    Message: [IMS]: 233760, 236435 3,4번

- [bugfix] [patch] 리스트 항목 입력 폼에 key 비어 있을 때 중복 validation 체크 되던 것 안 되게 수정 (yeonggyulim) 
    Message: [IMS]: 233760, 236435 2번

- [refactor] [patch] 중복 에러 메시지 위치 수정 (yeonggyulim) 
    Message: [IMS]: 233760, 236435 1번

- [feat][patch] 파이프라인 빌더 안내 메시지 번역 적용 (miri_jo) 
    Message: [IMS] 234651

- [feat][patch] template instance create 설명 추가 IMS : 238257 (신은경) 
    Message: 
- [bugfix][patch] 파이프라인 생성 시 비정상적인 URL 로 라우팅되는 버그 수정 (miri_jo) 
    Message: [IMS] 234651

- [bugfix][patch] Role->Binding 탭에 TextFilter 영역 제거 (이경준) 
    Message: 
- [bugfix][patch] Role->Binding 탭에 sort 기능 제거 (이경준) 
    Message: 
- [bugfix][patch] Persistent volume claim - yaml editor sidebar 항목 2번 영문 컨텐츠 수정 (심소영) 
    Message: [IMS] 224866

- [refactor] [patch] 단위 드랍다운 메뉴에서 Ei, E 제거 Registry, Limit Range, NamespaceClaim, ResourceQuotaClaim (yeonggyulim) 
    Message: [IMS]: 238544

- [refactor] [patch] ResourceQuotaClaim, NamespaceClaim, ResourceQuota 생성 폼 에디터에서 필수 제한값(CPU Limits, Memory Limits)에 대해서도 중복 체크해달라는 요청을 반영하여 수정 (yeonggyulim) 
    Message: 
- [bugfix] [patch] NamespaceClaim, resourceQuotaClaim 생성 폼 에디터 필수 입력값 체크 수정 및 버그 수정 (yeonggyulim) 
    Message: [IMS]:  236444

- [refactor] [patch] namespaceClaim, resourceQuotaClaim 생성 폼 에디터에 필수 제한 입력값에 대한 입력 체크 validation 추가 (yeonggyulim) 
    Message: 
- [bugfix][patch] Template, Catalog Service Claim 생성 default yaml 에  urlDescription 정보 추가 (심소영) 
    Message: [IMS] 237725

- [bugfix][patch] 레지스트리 폼 에디터 - pvc dropdown 버그 수정 (심소영) 
    Message: [IMS] 238599

- [bugfix] [patch] CRD 리스트페이지에 목록 클릭 시 링크 잘못 보내지는 현상 fix (yeonggyulim) 
    Message: 
- [bugfix][patch] KF 서빙 - 상태 데이터 잘못 나오는 현상 수정 (심소영) 
    Message: [IMs] 238837

- [feat][patch] Role/RoleBinding/RoleBindingClaim String 전체 점검 및 반영 (yeojin_choi) 
    Message: 
- [bugfix][patch] 워크 플로우 시작 시간, 종료 시간 순서 잘못되어있는 버그 수정, 종료 시간 null 일 때 처리 (심소영) 
    Message: [IMS] 238854

- [bugfix][patch] namespace detail - 파드 별 메모리 사용량 metric 내림차순으로 수정 (심소영) 
    Message: [IMS] 238790

- [refactor] [patch] Replica set 사이드바 영문 번역 적용 (yeonggyulim) 
    Message: [IMS]: 223698

- [bugfix][patch] Deployment - Sample Yaml Editor 오타 수정 사항 반영 (yeojin_choi) 
    Message: IMS: 223794

- [bugfix][patch] customNav - key prop 없다는 warning 해결 (yeojin_choi) 
    Message: 
- [feat][patch] 가상머신 생성 시 centos6 샘플 제거 (miri_jo) 
    Message: [IMS] 238972

- [bugfix][patch] task 폼 에디터 생성시 namespace undefined로 뜨는 버그, step modal에서 image registry 안부르는 버그 수정 (이경준) 
    Message: 