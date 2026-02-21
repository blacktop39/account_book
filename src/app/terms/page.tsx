import { Metadata } from "next";

export const metadata: Metadata = {
  title: "서비스 이용약관 - 가계부",
  description: "가계부 서비스 이용약관",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">서비스 이용약관</h1>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <p className="text-[var(--text-secondary)] mb-8">
              최종 수정일: {new Date().toLocaleDateString("ko-KR")}
            </p>

            <p className="mb-4">
              본 약관은 가계부("서비스")의 이용과 관련하여 서비스와 이용자 간의
              권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">제1조 (목적)</h2>
            <p className="text-[var(--text-secondary)]">
              본 약관은 가계부가 제공하는 모든 서비스의 이용조건 및 절차,
              이용자와 서비스 간의 권리, 의무, 책임사항과 기타 필요한 사항을
              규정함을 목적으로 합니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">제2조 (정의)</h2>
            <ul className="list-disc list-inside space-y-2 text-[var(--text-secondary)]">
              <li>
                "서비스"란 가계부가 제공하는 가계부 관리, 통계 분석 등의 모든 서비스를 의미합니다.
              </li>
              <li>
                "이용자"란 본 약관에 따라 서비스를 이용하는 회원 및 비회원을 의미합니다.
              </li>
              <li>
                "회원"이란 서비스에 가입하여 개인정보를 제공하고 계정을 생성한 자를 의미합니다.
              </li>
              <li>
                "계정"이란 서비스 이용을 위해 회원이 생성한 고유한 사용자 식별정보를 의미합니다.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">제3조 (약관의 효력 및 변경)</h2>
            <ol className="list-decimal list-inside space-y-2 text-[var(--text-secondary)]">
              <li>본 약관은 서비스를 이용하고자 하는 모든 이용자에게 적용됩니다.</li>
              <li>
                서비스는 필요한 경우 관련 법령을 위배하지 않는 범위 내에서
                본 약관을 변경할 수 있습니다.
              </li>
              <li>
                약관이 변경되는 경우, 서비스는 변경사항을 시행일자 7일 전부터
                서비스 내 공지사항을 통해 공지합니다.
              </li>
              <li>
                이용자가 변경된 약관에 동의하지 않는 경우, 서비스 이용을 중단하고
                탈퇴할 수 있습니다.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">제4조 (회원가입)</h2>
            <ol className="list-decimal list-inside space-y-2 text-[var(--text-secondary)]">
              <li>
                이용자는 서비스가 정한 가입 양식에 따라 회원정보를 입력하고
                본 약관에 동의함으로써 회원가입을 신청합니다.
              </li>
              <li>
                서비스는 다음 각 호에 해당하지 않는 한 회원가입을 승낙합니다:
                <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                  <li>가입신청자가 본 약관에 의하여 이전에 회원자격을 상실한 적이 있는 경우</li>
                  <li>실명이 아니거나 타인의 명의를 이용한 경우</li>
                  <li>허위의 정보를 기재하거나, 서비스가 제시하는 내용을 기재하지 않은 경우</li>
                  <li>만 14세 미만인 경우</li>
                </ul>
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">제5조 (서비스의 제공)</h2>
            <ol className="list-decimal list-inside space-y-2 text-[var(--text-secondary)]">
              <li>
                서비스는 다음과 같은 업무를 제공합니다:
                <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                  <li>수입 및 지출 기록 관리</li>
                  <li>카테고리별 거래 내역 분류</li>
                  <li>통계 및 분석 기능</li>
                  <li>기타 서비스가 추가 개발하거나 제휴계약 등을 통해 제공하는 일체의 서비스</li>
                </ul>
              </li>
              <li>
                서비스는 시스템 점검, 보수 또는 기타 기술적인 이유로 서비스 제공을
                일시적으로 중단할 수 있습니다.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">제6조 (회원의 의무)</h2>
            <ol className="list-decimal list-inside space-y-2 text-[var(--text-secondary)]">
              <li>
                회원은 다음 행위를 하여서는 안 됩니다:
                <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                  <li>신청 또는 변경 시 허위 내용의 등록</li>
                  <li>타인의 정보 도용</li>
                  <li>서비스에 게시된 정보의 변경</li>
                  <li>서비스가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시</li>
                  <li>서비스 및 기타 제3자의 저작권 등 지적재산권에 대한 침해</li>
                  <li>서비스 및 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
                </ul>
              </li>
              <li>
                회원은 관계법령, 본 약관의 규정, 이용안내 및 서비스와 관련하여
                공지한 주의사항을 준수해야 합니다.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">제7조 (개인정보의 보호)</h2>
            <ol className="list-decimal list-inside space-y-2 text-[var(--text-secondary)]">
              <li>
                서비스는 관련 법령이 정하는 바에 따라 회원의 개인정보를 보호하기 위해
                노력합니다.
              </li>
              <li>
                개인정보의 보호 및 사용에 대해서는 관련법령 및 서비스의
                개인정보 처리방침이 적용됩니다.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">제8조 (서비스의 중단)</h2>
            <p className="text-[var(--text-secondary)] mb-4">
              서비스는 다음의 경우 서비스 제공을 중단할 수 있습니다:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[var(--text-secondary)]">
              <li>설비의 보수 등 공사로 인해 부득이한 경우</li>
              <li>전기통신사업법에 규정된 기간통신사업자가 전기통신 서비스를 중지한 경우</li>
              <li>시스템 점검이 필요한 경우</li>
              <li>기타 불가항력적 사유가 있는 경우</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">제9조 (면책조항)</h2>
            <ol className="list-decimal list-inside space-y-2 text-[var(--text-secondary)]">
              <li>
                서비스는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를
                제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.
              </li>
              <li>
                서비스는 회원의 귀책사유로 인한 서비스 이용의 장애에 대하여
                책임을 지지 않습니다.
              </li>
              <li>
                서비스는 회원이 서비스를 이용하여 기대하는 수익을 얻지 못하거나
                상실한 것에 대하여 책임을 지지 않습니다.
              </li>
              <li>
                서비스는 회원이 서비스에 게재한 정보, 자료, 사실의 신뢰도,
                정확성 등에 대해서는 책임을 지지 않습니다.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">제10조 (회원 탈퇴 및 자격 상실)</h2>
            <ol className="list-decimal list-inside space-y-2 text-[var(--text-secondary)]">
              <li>
                회원은 서비스에 언제든지 탈퇴를 요청할 수 있으며,
                서비스는 즉시 회원 탈퇴를 처리합니다.
              </li>
              <li>
                회원이 다음 각 호의 사유에 해당하는 경우, 서비스는 회원자격을
                제한 및 정지시킬 수 있습니다:
                <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                  <li>가입 신청 시 허위 내용을 등록한 경우</li>
                  <li>다른 사람의 서비스 이용을 방해하거나 정보를 도용하는 등 질서를 위협하는 경우</li>
                  <li>서비스를 이용하여 법령 또는 본 약관이 금지하는 행위를 하는 경우</li>
                </ul>
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">제11조 (광고 게재)</h2>
            <ol className="list-decimal list-inside space-y-2 text-[var(--text-secondary)]">
              <li>
                서비스는 서비스 운영을 위해 서비스 내에 광고를 게재할 수 있습니다.
              </li>
              <li>
                회원은 서비스 이용 시 노출되는 광고에 대해 동의한 것으로 간주됩니다.
              </li>
              <li>
                서비스는 광고 게재로 인한 손해에 대해 책임을 지지 않습니다.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">제12조 (분쟁 해결)</h2>
            <ol className="list-decimal list-inside space-y-2 text-[var(--text-secondary)]">
              <li>
                서비스는 이용자로부터 제출되는 불만사항 및 의견을 신속하게
                처리하도록 노력합니다.
              </li>
              <li>
                서비스와 이용자 간에 발생한 분쟁에 관한 소송은 민사소송법상의
                관할법원에 제기합니다.
              </li>
              <li>
                서비스와 이용자 간에 제기된 소송에는 대한민국 법을 적용합니다.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">부칙</h2>
            <p className="text-[var(--text-secondary)]">
              본 약관은 {new Date().toLocaleDateString("ko-KR")}부터 시행됩니다.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
