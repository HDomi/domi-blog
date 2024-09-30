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
