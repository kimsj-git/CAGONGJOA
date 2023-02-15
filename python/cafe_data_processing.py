# C:\Users\SSAFY\Desktop\8조프로젝트\data\rawdatas

import pandas as pd
import os

# 전국 카페 데이터를 병합할 빈 데이터프레임
cafe_all_region = pd.DataFrame()

# 지역별 상가 데이터를 순회하면서
files = os.listdir(rf'C:/Users/SSAFY/Desktop/test/cafeData/data')
for file in files:
    df = pd.read_csv(f'C:/Users/SSAFY/Desktop/test/cafeData/data/{file}', low_memory=False)
    df = df[df['상권업종중분류코드']=='Q12']                             # 카페만 필터링
    cafe_all_region = pd.concat([cafe_all_region, df])                 # cafe_all_region에 병합

cafe_all_region.shape # (110455, 39)

# 필요한 컬럼만 추출
cafe_all_region = cafe_all_region[['상가업소번호', '상호명', '지점명', '도로명주소', '경도', '위도']]

cafe_all_region.shape # (110455, 6)
cafe_all_region.columns # Index(['상가업소번호', '상호명', '지점명', '도로명주소', '경도', '위도'], dtype='object')


kakao_get_data = pd.read_csv(rf'C:/Users/SSAFY/Desktop/test/output_seoul.csv')
kakao_get_data.shape # (33553, 12)
kakao_get_data.columns # Index(['상가업소번호', '상호명', '지점명', '도로명주소', '경도', '위도'], dtype='object')

# 필요한 컬럼만 뽑기
# kakao_get_data = kakao_get_data[['상가업소번호', '상호명', '지점명', '도로명주소', '경도', '위도']]
kakao_get_data = kakao_get_data[['id', 'place_name', 'road_address_name', 'x', 'y']]
kakao_get_data.columns

# 지점명 빈컬럼 추가
# kakao_get_data['지점명'] = None
kakao_get_data['지점명'] = ""
kakao_get_data['지점명']


# [['상가업소번호', '상호명', '지점명', '도로명주소', '경도', '위도']]
kakao_get_data = kakao_get_data.rename(columns={'id':'상가업소번호', 'place_name':'상호명', 'road_address_name':'도로명주소', 'x':'경도', 'y':'위도'})
kakao_get_data.columns
kakao_get_data.head()

# 컬럼순서 변경
kakao_get_data = kakao_get_data.reindex(columns=['상가업소번호', '상호명', '지점명', '도로명주소', '경도', '위도'])


cafe_brands = ['스타벅스', '이디야커피', '투썸플레이스', '메가커피', '컴포즈커피', '빽다방', '커피에반하다', '요거프레소', '베스킨라빈스',
               '커피베이', '파스쿠찌', '더벤티', '할리스', '엔제리너스', '나우커피', '탐앤탐스', '카페베네', '매머드', '텐퍼센트커피',
               '커피빈', '폴바셋', '달콤커피', '커피스미스', '드롭탑', '커피나무', '셀렉토커피', '토프레소', '전광수', '감성커피',
               '공차', '스무디킹', '드롭탑', '카페띠아모']

# 정제한 카페 데이터를 넣을 빈 데이터프레임
cafe_data = pd.DataFrame(columns=['상가업소번호', '상호명', '브랜드타입', '위도', '경도', '도로명주소'])

row = 0
for cafe in kakao_get_data.itertuples():
    # 체인점과 개인카페를 구별하는 작업
    for cafe_brand in cafe_brands:  # 카페 브랜드 목록 중 하나라도
        if cafe_brand in cafe.상호명:  # 상호명에 포함되어 있는 경우
            brand_name = cafe_brand
            break
    else:  # 상호명에 어떤 브랜드 명도 포함되어 있지 않은 경우 개인카페로 처리
        brand_name = '개인카페'

    # 카페 이름을 정제하는 작업
    if pd.isna(cafe.지점명):  # 지점명이 없는 경우 기존의 상호명 유지
        cafe_name = cafe.상호명
    elif cafe.지점명 in cafe.상호명:  # 상호명에 이미 지점명이 포함되어 있는 경우, 지점명 앞에 공백을 붙여준다.
        cafe_name = cafe.상호명.replace(cafe.지점명, f' {cafe.지점명}')
    else:  # 상호명에 지점명이 포함되어 있지 않다면, 상호명과 지점명 사이에 공백을 두고 이어준다.
        cafe_name = f"{cafe.상호명} {cafe.지점명}"

    # cafe_data에 병합
    cafe_data.loc[row] = [cafe.상가업소번호, cafe_name, brand_name, cafe.위도, cafe.경도, cafe.도로명주소]
    row += 1

    # 진행률 출력
    if row % 10000 == 0:
        print(f'{row}개 행 완료!')

cafe_data.shape

# 특정 조건을 만족하는 행 삭제
cafe_data.drop(cafe_data[(cafe_data['상호명'].str.contains('편의점'))].index, inplace=True)
cafe_data.drop(cafe_data[(cafe_data['상호명'].str.contains('애견'))].index, inplace=True)
cafe_data.drop(cafe_data[(cafe_data['상호명'].str.contains('키즈'))].index, inplace=True)
cafe_data.drop(cafe_data[(cafe_data['상호명'].str.contains('노래방'))].index, inplace=True)
cafe_data.drop(cafe_data[(cafe_data['상호명'].str.contains('노래연습장'))].index, inplace=True)

# 결측치 여부 확인
cafe_data.isnull().sum() # 156
backup_cafe = cafe_data.copy()
backup_cafe.shape # 33553

cafe_data = cafe_data.dropna(subset=['도로명주소'])
cafe_data.shape
cafe_data.head()

cafe_data['상호명'] = cafe_data['상호명'].str.replace('   ', '@@')
cafe_data.head()

cafe_data['상호명'] = cafe_data['상호명'].str.replace(' ', '')
cafe_data.head()

cafe_data['상호명'] = cafe_data['상호명'].str.replace('@@', ' ')
cafe_data.head()


cafe_data.to_csv('C:/Users/SSAFY/Desktop/test/cafe.csv', sep=',', index=False, columns=['상가업소번호', '상호명', '브랜드타입'], header=['cafe_code', 'name', 'brand_type'], encoding="utf-8-sig")
cafe_data.to_csv('C:/Users/SSAFY/Desktop/test/cafe_idx.csv', sep=',', index=True, columns=['상가업소번호', '상호명', '브랜드타입'], header=['cafe_code', 'name', 'brand_type'], encoding="utf-8-sig")
cafe_data.to_csv('C:/Users/SSAFY/Desktop/test/cafe_location.csv', sep=',', index=False, columns=['위도', '경도', '도로명주소'], header=['lat', 'lng', 'address'], encoding="utf-8-sig")
cafe_data.to_csv('C:/Users/SSAFY/Desktop/test/cafe_location_idx.csv', sep=',', index=True, columns=['위도', '경도', '도로명주소'], header=['lat', 'lng', 'address'], encoding="utf-8-sig")













