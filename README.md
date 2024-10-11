## Info

#### Node Version: 20.15.1

tailwind
yarn

## Getting Started

First, run the development server:

```bash
yarn dev
```

## History

[240923] - init  
[240923] - post create 적용  
[240925] - md 형식으로 글을 작성할 수 있도록 적용 feat.@toast-ui/editor  
[240926] - 리스트 레이아웃 변경 / supabase 카테고리 관련 api 추가

```
await supabase.rpc("get_post_category_with_count");


create or replace function get_post_category_with_count()
returns table(category text, count int)
language sql
as $$
  select category, count(*)
  from posts
  group by category
  order by category;
$$;
```

[240930] - 디자인 정리  
[240930] - 글쓰기, 글보기 페이지 디자인 및 동작수정  
[241002] - api 호출을 react hook형태로 사용하도록 수정  
[241002] - post create react hook 형태로 수정 / modify추가

```
searchParams를 사용하려면 Suspense로 감싸야함
훅은 클라이언트 사이드에서만 사용할 수 있으므로, 이를 해결하기 위해
조건부 렌더링을 사용하여 클라이언트 사이드에서만 해당 훅을 사용하도록 해야 함
```

[241008] - 메세지 컴포넌트 분리
[241008] - messageProvider > layoutProvider로 교체 후 로딩관련 로직과 통합  
[241010] - blog 리스트 반응형 레이아웃 추가  
[241011] - 사진업로드 테스트완료 및 코드정리
