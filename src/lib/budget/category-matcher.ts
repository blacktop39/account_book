// 키워드 기반 카테고리 자동 매칭

interface CategoryMatch {
  parentName: string;
  childName?: string;
}

// 키워드 → 카테고리 매핑
const KEYWORD_MAP: Record<string, CategoryMatch> = {
  // 식비 > 주식
  밥: { parentName: "식비", childName: "주식" },
  식사: { parentName: "식비", childName: "주식" },
  점심: { parentName: "식비", childName: "주식" },
  저녁: { parentName: "식비", childName: "주식" },
  아침: { parentName: "식비", childName: "주식" },
  백반: { parentName: "식비", childName: "주식" },
  김밥: { parentName: "식비", childName: "주식" },
  라면: { parentName: "식비", childName: "주식" },
  국밥: { parentName: "식비", childName: "주식" },
  비빔밥: { parentName: "식비", childName: "주식" },
  볶음밥: { parentName: "식비", childName: "주식" },
  덮밥: { parentName: "식비", childName: "주식" },
  죽: { parentName: "식비", childName: "주식" },

  // 식비 > 부식
  마트: { parentName: "식비", childName: "부식" },
  장보기: { parentName: "식비", childName: "부식" },
  식료품: { parentName: "식비", childName: "부식" },
  반찬: { parentName: "식비", childName: "부식" },
  채소: { parentName: "식비", childName: "부식" },
  과일: { parentName: "식비", childName: "부식" },
  정육점: { parentName: "식비", childName: "부식" },
  고기: { parentName: "식비", childName: "부식" },

  // 식비 > 간식
  커피: { parentName: "식비", childName: "간식" },
  카페: { parentName: "식비", childName: "간식" },
  스타벅스: { parentName: "식비", childName: "간식" },
  투썸: { parentName: "식비", childName: "간식" },
  빵: { parentName: "식비", childName: "간식" },
  베이커리: { parentName: "식비", childName: "간식" },
  과자: { parentName: "식비", childName: "간식" },
  아이스크림: { parentName: "식비", childName: "간식" },
  디저트: { parentName: "식비", childName: "간식" },
  케이크: { parentName: "식비", childName: "간식" },
  음료: { parentName: "식비", childName: "간식" },
  편의점: { parentName: "식비", childName: "간식" },

  // 식비 > 외식
  외식: { parentName: "식비", childName: "외식" },
  회식: { parentName: "식비", childName: "외식" },
  삼겹살: { parentName: "식비", childName: "외식" },
  치킨: { parentName: "식비", childName: "외식" },
  피자: { parentName: "식비", childName: "외식" },
  햄버거: { parentName: "식비", childName: "외식" },
  맥도날드: { parentName: "식비", childName: "외식" },
  초밥: { parentName: "식비", childName: "외식" },
  스시: { parentName: "식비", childName: "외식" },
  회: { parentName: "식비", childName: "외식" },
  고깃집: { parentName: "식비", childName: "외식" },
  술집: { parentName: "식비", childName: "외식" },
  맥주: { parentName: "식비", childName: "외식" },
  술: { parentName: "식비", childName: "외식" },
  소주: { parentName: "식비", childName: "외식" },
  배달: { parentName: "식비", childName: "외식" },

  // 교통 > 대중교통
  지하철: { parentName: "교통", childName: "대중교통" },
  버스: { parentName: "교통", childName: "대중교통" },
  전철: { parentName: "교통", childName: "대중교통" },
  기차: { parentName: "교통", childName: "대중교통" },
  ktx: { parentName: "교통", childName: "대중교통" },
  srt: { parentName: "교통", childName: "대중교통" },
  교통카드: { parentName: "교통", childName: "대중교통" },
  티머니: { parentName: "교통", childName: "대중교통" },

  // 교통 > 택시
  택시: { parentName: "교통", childName: "택시" },
  카카오택시: { parentName: "교통", childName: "택시" },
  우버: { parentName: "교통", childName: "택시" },
  대리: { parentName: "교통", childName: "택시" },
  대리운전: { parentName: "교통", childName: "택시" },

  // 교통 > 주유
  주유: { parentName: "교통", childName: "주유" },
  기름: { parentName: "교통", childName: "주유" },
  휘발유: { parentName: "교통", childName: "주유" },
  경유: { parentName: "교통", childName: "주유" },
  주유소: { parentName: "교통", childName: "주유" },
  충전: { parentName: "교통", childName: "주유" },

  // 교통 > 차량유지
  세차: { parentName: "교통", childName: "차량유지" },
  정비: { parentName: "교통", childName: "차량유지" },
  수리: { parentName: "교통", childName: "차량유지" },
  보험: { parentName: "교통", childName: "차량유지" },
  자동차보험: { parentName: "교통", childName: "차량유지" },
  주차: { parentName: "교통", childName: "차량유지" },
  주차비: { parentName: "교통", childName: "차량유지" },
  톨비: { parentName: "교통", childName: "차량유지" },
  하이패스: { parentName: "교통", childName: "차량유지" },

  // 쇼핑 > 의류
  옷: { parentName: "쇼핑", childName: "의류" },
  의류: { parentName: "쇼핑", childName: "의류" },
  신발: { parentName: "쇼핑", childName: "의류" },
  가방: { parentName: "쇼핑", childName: "의류" },
  자켓: { parentName: "쇼핑", childName: "의류" },
  코트: { parentName: "쇼핑", childName: "의류" },
  바지: { parentName: "쇼핑", childName: "의류" },
  유니클로: { parentName: "쇼핑", childName: "의류" },
  자라: { parentName: "쇼핑", childName: "의류" },

  // 쇼핑 > 생활용품
  생활용품: { parentName: "쇼핑", childName: "생활용품" },
  세제: { parentName: "쇼핑", childName: "생활용품" },
  휴지: { parentName: "쇼핑", childName: "생활용품" },
  다이소: { parentName: "쇼핑", childName: "생활용품" },
  청소: { parentName: "쇼핑", childName: "생활용품" },

  // 쇼핑 > 전자제품
  핸드폰: { parentName: "쇼핑", childName: "전자제품" },
  폰: { parentName: "쇼핑", childName: "전자제품" },
  노트북: { parentName: "쇼핑", childName: "전자제품" },
  컴퓨터: { parentName: "쇼핑", childName: "전자제품" },
  이어폰: { parentName: "쇼핑", childName: "전자제품" },
  충전기: { parentName: "쇼핑", childName: "전자제품" },
  가전: { parentName: "쇼핑", childName: "전자제품" },

  // 여가 > 영화/공연
  영화: { parentName: "여가", childName: "영화/공연" },
  cgv: { parentName: "여가", childName: "영화/공연" },
  메가박스: { parentName: "여가", childName: "영화/공연" },
  롯데시네마: { parentName: "여가", childName: "영화/공연" },
  공연: { parentName: "여가", childName: "영화/공연" },
  뮤지컬: { parentName: "여가", childName: "영화/공연" },
  콘서트: { parentName: "여가", childName: "영화/공연" },

  // 여가 > 게임
  게임: { parentName: "여가", childName: "게임" },
  pc방: { parentName: "여가", childName: "게임" },
  스팀: { parentName: "여가", childName: "게임" },
  닌텐도: { parentName: "여가", childName: "게임" },

  // 여가 > 취미
  취미: { parentName: "여가", childName: "취미" },
  책: { parentName: "여가", childName: "취미" },
  도서: { parentName: "여가", childName: "취미" },
  교보문고: { parentName: "여가", childName: "취미" },
  악기: { parentName: "여가", childName: "취미" },

  // 여가 > 운동
  헬스: { parentName: "여가", childName: "운동" },
  헬스장: { parentName: "여가", childName: "운동" },
  gym: { parentName: "여가", childName: "운동" },
  필라테스: { parentName: "여가", childName: "운동" },
  요가: { parentName: "여가", childName: "운동" },
  수영: { parentName: "여가", childName: "운동" },
  골프: { parentName: "여가", childName: "운동" },
  등산: { parentName: "여가", childName: "운동" },

  // 공과금 > 전기
  전기세: { parentName: "공과금", childName: "전기" },
  전기요금: { parentName: "공과금", childName: "전기" },
  한전: { parentName: "공과금", childName: "전기" },

  // 공과금 > 수도
  수도세: { parentName: "공과금", childName: "수도" },
  수도요금: { parentName: "공과금", childName: "수도" },

  // 공과금 > 가스
  가스비: { parentName: "공과금", childName: "가스" },
  가스요금: { parentName: "공과금", childName: "가스" },
  도시가스: { parentName: "공과금", childName: "가스" },

  // 공과금 > 통신
  통신비: { parentName: "공과금", childName: "통신" },
  인터넷: { parentName: "공과금", childName: "통신" },
  휴대폰요금: { parentName: "공과금", childName: "통신" },
  skt: { parentName: "공과금", childName: "통신" },
  kt: { parentName: "공과금", childName: "통신" },
  lg유플러스: { parentName: "공과금", childName: "통신" },
  넷플릭스: { parentName: "공과금", childName: "통신" },
  유튜브: { parentName: "공과금", childName: "통신" },
  구독: { parentName: "공과금", childName: "통신" },

  // 수입 카테고리
  월급: { parentName: "급여" },
  급여: { parentName: "급여" },
  연봉: { parentName: "급여" },
  보너스: { parentName: "보너스" },
  인센티브: { parentName: "보너스" },
  상여금: { parentName: "보너스" },
  용돈: { parentName: "기타수입" },
  환급: { parentName: "기타수입" },
};

export interface CategorySuggestion {
  parentId: string;
  parentName: string;
  childId?: string;
  childName?: string;
}

/**
 * 입력된 설명에서 카테고리를 추천
 */
export function suggestCategory(
  description: string,
  categories: Array<{
    id: string;
    name: string;
    type: string;
    children?: Array<{ id: string; name: string }>;
  }>
): CategorySuggestion | null {
  if (!description.trim()) return null;

  const lowerDesc = description.toLowerCase();

  // 키워드 매칭
  for (const [keyword, match] of Object.entries(KEYWORD_MAP)) {
    if (lowerDesc.includes(keyword.toLowerCase())) {
      // 부모 카테고리 찾기
      const parent = categories.find((c) => c.name === match.parentName);
      if (!parent) continue;

      // 서브카테고리가 있으면 찾기
      if (match.childName && parent.children) {
        const child = parent.children.find((c) => c.name === match.childName);
        if (child) {
          return {
            parentId: parent.id,
            parentName: parent.name,
            childId: child.id,
            childName: child.name,
          };
        }
      }

      // 서브카테고리 없으면 부모만 반환
      return {
        parentId: parent.id,
        parentName: parent.name,
      };
    }
  }

  return null;
}
