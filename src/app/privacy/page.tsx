import { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보 처리방침 - 가계부",
  description: "가계부 서비스의 개인정보 처리방침",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">개인정보 처리방침</h1>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <p className="text-[var(--text-secondary)] mb-8">
              최종 수정일: {new Date().toLocaleDateString("ko-KR")}
            </p>

            <p className="mb-4">
              가계부("서비스")는 사용자의 개인정보를 소중히 생각하며,
              개인정보보호법을 준수합니다. 본 개인정보 처리방침은 서비스 이용 시
              수집되는 정보와 그 사용 방법을 설명합니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">1. 수집하는 정보</h2>

            <h3 className="text-xl font-medium mb-3 mt-6">1.1 사용자가 제공하는 정보</h3>
            <ul className="list-disc list-inside space-y-2 text-[var(--text-secondary)]">
              <li>이메일 주소</li>
              <li>이름</li>
              <li>비밀번호 (암호화 저장)</li>
              <li>가계부 데이터 (수입, 지출, 카테고리 등)</li>
            </ul>

            <h3 className="text-xl font-medium mb-3 mt-6">1.2 자동으로 수집되는 정보</h3>
            <ul className="list-disc list-inside space-y-2 text-[var(--text-secondary)]">
              <li>IP 주소</li>
              <li>브라우저 종류 및 버전</li>
              <li>기기 정보 (OS, 화면 크기)</li>
              <li>서비스 이용 기록 (접속 시간, 사용 기능)</li>
              <li>쿠키 및 유사 기술</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. 정보 사용 목적</h2>
            <ul className="list-disc list-inside space-y-2 text-[var(--text-secondary)]">
              <li>서비스 제공 및 운영</li>
              <li>사용자 인증 및 계정 관리</li>
              <li>가계부 기능 제공 (거래 기록, 통계, 예산 관리)</li>
              <li>서비스 개선 및 새로운 기능 개발</li>
              <li>고객 지원 및 문의 응대</li>
              <li>서비스 악용 방지 및 보안 유지</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. 광고 및 제3자 서비스</h2>

            <h3 className="text-xl font-medium mb-3 mt-6">3.1 Google AdSense</h3>
            <p className="text-[var(--text-secondary)] mb-4">
              서비스는 Google AdSense를 통해 광고를 표시합니다. Google은 쿠키와
              웹 비콘을 사용하여 사용자의 관심사에 맞는 광고를 제공합니다.
            </p>
            <ul className="list-disc list-inside space-y-2 text-[var(--text-secondary)] mb-4">
              <li>Google의 쿠키 사용 및 광고 정책에 동의하게 됩니다</li>
              <li>Google 광고 설정에서 맞춤 광고를 관리할 수 있습니다</li>
              <li>
                자세한 내용:{" "}
                <a
                  href="https://policies.google.com/technologies/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  Google 광고 정책
                </a>
              </li>
            </ul>

            <h3 className="text-xl font-medium mb-3 mt-6">3.2 Google AdMob (모바일 앱)</h3>
            <p className="text-[var(--text-secondary)] mb-4">
              모바일 앱에서는 Google AdMob을 통해 광고를 표시합니다.
              AdMob은 광고 ID를 사용하여 맞춤 광고를 제공합니다.
            </p>
            <ul className="list-disc list-inside space-y-2 text-[var(--text-secondary)]">
              <li>Android: 광고 ID 수집 및 사용</li>
              <li>기기 설정에서 광고 추적을 제한할 수 있습니다</li>
              <li>광고 ID 재설정 가능 (설정 &gt; Google &gt; 광고)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. 정보 공유 및 제3자 제공</h2>
            <p className="text-[var(--text-secondary)] mb-4">
              사용자의 개인정보는 다음의 경우를 제외하고는 제3자에게 제공되지 않습니다:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[var(--text-secondary)]">
              <li>사용자의 명시적 동의가 있는 경우</li>
              <li>법적 요구사항 (법원 명령, 정부 기관 요청)</li>
              <li>서비스 제공을 위한 필수 파트너 (Google AdSense, AdMob, 호스팅 제공자)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. 데이터 보관 및 삭제</h2>
            <ul className="list-disc list-inside space-y-2 text-[var(--text-secondary)]">
              <li>계정 정보: 계정 삭제 시까지 보관</li>
              <li>가계부 데이터: 계정 삭제 시 즉시 삭제</li>
              <li>로그 데이터: 최대 1년 보관 후 자동 삭제</li>
              <li>법적 요구사항에 따라 일부 정보는 더 오래 보관될 수 있습니다</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. 사용자 권리</h2>
            <p className="text-[var(--text-secondary)] mb-4">
              사용자는 다음의 권리를 가집니다:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[var(--text-secondary)]">
              <li>개인정보 열람 및 수정 권리</li>
              <li>개인정보 삭제 요구 권리 (계정 삭제)</li>
              <li>개인정보 처리 정지 요구 권리</li>
              <li>데이터 이동권 (가계부 데이터 내보내기)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. 쿠키 및 유사 기술</h2>
            <p className="text-[var(--text-secondary)] mb-4">
              서비스는 쿠키 및 유사 기술을 사용합니다:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[var(--text-secondary)]">
              <li>필수 쿠키: 로그인 세션 유지, 보안</li>
              <li>분석 쿠키: 서비스 사용 통계</li>
              <li>광고 쿠키: Google AdSense 맞춤 광고</li>
            </ul>
            <p className="text-[var(--text-secondary)] mt-4">
              브라우저 설정에서 쿠키를 차단할 수 있으나, 일부 기능이 제한될 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. 보안</h2>
            <p className="text-[var(--text-secondary)]">
              사용자의 개인정보를 보호하기 위해 다음의 보안 조치를 취합니다:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[var(--text-secondary)]">
              <li>비밀번호 암호화 (bcrypt)</li>
              <li>HTTPS 암호화 통신</li>
              <li>데이터베이스 접근 제한</li>
              <li>정기적인 보안 업데이트</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. 아동 개인정보 보호</h2>
            <p className="text-[var(--text-secondary)]">
              서비스는 만 14세 미만 아동을 대상으로 하지 않으며,
              의도적으로 아동의 개인정보를 수집하지 않습니다.
              아동의 정보가 수집된 것을 발견한 경우 즉시 삭제합니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. 개인정보 처리방침 변경</h2>
            <p className="text-[var(--text-secondary)]">
              본 개인정보 처리방침은 법령 및 서비스 변경에 따라 수정될 수 있습니다.
              중요한 변경사항이 있을 경우 서비스 내 공지사항을 통해 알려드립니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. 개인정보 보호책임자</h2>
            <p className="text-[var(--text-secondary)] mb-4">
              가계부는 이용자의 개인정보를 보호하고 개인정보와 관련된 불만을 처리하기 위하여
              아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
            </p>
            <ul className="list-none space-y-2 text-[var(--text-secondary)] mt-4 bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4">
              <li className="font-medium text-[var(--text-primary)]">▪ 개인정보 보호책임자</li>
              <li className="ml-4">- 성명: Andrew (전상호)</li>
              <li className="ml-4">- 직책: 서비스 관리자</li>
              <li className="ml-4">- 이메일: blacktop39@gmail.com</li>
            </ul>
            <p className="text-[var(--text-secondary)] mt-4">
              개인정보 침해에 대한 신고나 상담이 필요한 경우 아래 기관에 문의하실 수 있습니다:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[var(--text-secondary)] mt-2 ml-4">
              <li>개인정보침해신고센터 (privacy.kisa.or.kr / 국번없이 118)</li>
              <li>대검찰청 사이버범죄수사단 (www.spo.go.kr / 국번없이 1301)</li>
              <li>경찰청 사이버안전국 (cyberbureau.police.go.kr / 국번없이 182)</li>
            </ul>
          </section>

          <section className="mt-12 pt-8 border-t border-[var(--border)]">
            <p className="text-sm text-[var(--text-secondary)]">
              이 개인정보 처리방침은 {new Date().toLocaleDateString("ko-KR")}부터 시행됩니다.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
