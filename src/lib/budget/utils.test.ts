import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  generateId,
  formatAmount,
  formatAmountShort,
  formatDate,
  formatMonth,
  getToday,
  getCurrentMonth,
  getAdjacentMonth,
  getMonthRange,
  getDaysInMonth,
  filterTransactionsByMonth,
  groupTransactionsByDate,
  calculateMonthSummary,
} from "./utils";
import { Transaction } from "./types";

describe("generateId", () => {
  it("고유한 ID를 생성해야 한다", () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(id1).not.toBe(id2);
  });

  it("문자열 ID를 반환해야 한다", () => {
    const id = generateId();
    expect(typeof id).toBe("string");
    expect(id.length).toBeGreaterThan(0);
  });
});

describe("formatAmount", () => {
  it("천 단위 구분자를 추가해야 한다", () => {
    expect(formatAmount(1000)).toBe("1,000");
    expect(formatAmount(1000000)).toBe("1,000,000");
    expect(formatAmount(123456789)).toBe("123,456,789");
  });

  it("0을 포맷해야 한다", () => {
    expect(formatAmount(0)).toBe("0");
  });

  it("소수점 이하는 그대로 유지해야 한다", () => {
    expect(formatAmount(1234.56)).toBe("1,234.56");
  });
});

describe("formatAmountShort", () => {
  it("1억 이상은 억 단위로 표시해야 한다", () => {
    expect(formatAmountShort(100000000)).toBe("1.0억");
    expect(formatAmountShort(250000000)).toBe("2.5억");
  });

  it("1만 이상 1억 미만은 만 단위로 표시해야 한다", () => {
    expect(formatAmountShort(10000)).toBe("1만");
    expect(formatAmountShort(50000)).toBe("5만");
    expect(formatAmountShort(1000000)).toBe("100만");
  });

  it("1만 미만은 일반 포맷으로 표시해야 한다", () => {
    expect(formatAmountShort(9999)).toBe("9,999");
    expect(formatAmountShort(100)).toBe("100");
  });
});

describe("formatDate", () => {
  it("날짜를 한국어 형식으로 포맷해야 한다", () => {
    const result = formatDate("2024-01-15");
    expect(result).toMatch(/1월 15일/);
  });

  it("요일을 포함해야 한다", () => {
    const result = formatDate("2024-01-15");
    expect(result).toMatch(/\(.\)/);
  });
});

describe("formatMonth", () => {
  it("월을 한국어 형식으로 포맷해야 한다", () => {
    expect(formatMonth("2024-01")).toBe("2024년 1월");
    expect(formatMonth("2024-12")).toBe("2024년 12월");
  });
});

describe("getToday", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-06-15T12:00:00"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("오늘 날짜를 YYYY-MM-DD 형식으로 반환해야 한다", () => {
    expect(getToday()).toBe("2024-06-15");
  });
});

describe("getCurrentMonth", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-06-15T12:00:00"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("현재 월을 YYYY-MM 형식으로 반환해야 한다", () => {
    expect(getCurrentMonth()).toBe("2024-06");
  });
});

describe("getAdjacentMonth", () => {
  it("다음 달을 계산해야 한다", () => {
    expect(getAdjacentMonth("2024-01", 1)).toBe("2024-02");
    expect(getAdjacentMonth("2024-12", 1)).toBe("2025-01");
  });

  it("이전 달을 계산해야 한다", () => {
    expect(getAdjacentMonth("2024-02", -1)).toBe("2024-01");
    expect(getAdjacentMonth("2024-01", -1)).toBe("2023-12");
  });

  it("여러 달을 이동할 수 있어야 한다", () => {
    expect(getAdjacentMonth("2024-01", 3)).toBe("2024-04");
    expect(getAdjacentMonth("2024-06", -6)).toBe("2023-12");
  });
});

describe("getMonthRange", () => {
  it("월의 시작과 끝 날짜를 반환해야 한다", () => {
    const { start, end } = getMonthRange("2024-01");
    expect(start.getDate()).toBe(1);
    expect(end.getDate()).toBe(31);
  });

  it("2월의 마지막 날짜를 올바르게 계산해야 한다", () => {
    const { end: end2024 } = getMonthRange("2024-02");
    expect(end2024.getDate()).toBe(29); // 윤년

    const { end: end2023 } = getMonthRange("2023-02");
    expect(end2023.getDate()).toBe(28); // 평년
  });
});

describe("getDaysInMonth", () => {
  it("해당 월의 모든 날짜 배열을 반환해야 한다", () => {
    const days = getDaysInMonth("2024-01");
    expect(days).toHaveLength(31);
  });

  it("2월의 날짜 수를 올바르게 반환해야 한다", () => {
    expect(getDaysInMonth("2024-02")).toHaveLength(29); // 윤년
    expect(getDaysInMonth("2023-02")).toHaveLength(28); // 평년
  });
});

describe("filterTransactionsByMonth", () => {
  const transactions: Transaction[] = [
    {
      id: "1",
      type: "income",
      amount: 1000,
      categoryId: "salary",
      description: "급여",
      date: "2024-01-15",
      createdAt: "2024-01-15T00:00:00Z",
    },
    {
      id: "2",
      type: "expense",
      amount: 500,
      categoryId: "food",
      description: "식비",
      date: "2024-01-20",
      createdAt: "2024-01-20T00:00:00Z",
    },
    {
      id: "3",
      type: "expense",
      amount: 200,
      categoryId: "transport",
      description: "교통비",
      date: "2024-02-01",
      createdAt: "2024-02-01T00:00:00Z",
    },
  ];

  it("해당 월의 거래만 필터링해야 한다", () => {
    const result = filterTransactionsByMonth(transactions, "2024-01");
    expect(result).toHaveLength(2);
    expect(result.every((t) => t.date.startsWith("2024-01"))).toBe(true);
  });

  it("거래가 없는 월은 빈 배열을 반환해야 한다", () => {
    const result = filterTransactionsByMonth(transactions, "2024-03");
    expect(result).toHaveLength(0);
  });

  it("빈 배열에서도 동작해야 한다", () => {
    const result = filterTransactionsByMonth([], "2024-01");
    expect(result).toHaveLength(0);
  });
});

describe("groupTransactionsByDate", () => {
  const transactions: Transaction[] = [
    {
      id: "1",
      type: "income",
      amount: 1000,
      categoryId: "salary",
      description: "급여",
      date: "2024-01-15",
      createdAt: "2024-01-15T00:00:00Z",
    },
    {
      id: "2",
      type: "expense",
      amount: 500,
      categoryId: "food",
      description: "점심",
      date: "2024-01-15",
      createdAt: "2024-01-15T00:00:00Z",
    },
    {
      id: "3",
      type: "expense",
      amount: 200,
      categoryId: "transport",
      description: "교통비",
      date: "2024-01-10",
      createdAt: "2024-01-10T00:00:00Z",
    },
  ];

  it("날짜별로 그룹화해야 한다", () => {
    const result = groupTransactionsByDate(transactions);
    expect(Object.keys(result)).toHaveLength(2);
    expect(result["2024-01-15"]).toHaveLength(2);
    expect(result["2024-01-10"]).toHaveLength(1);
  });

  it("날짜를 내림차순으로 정렬해야 한다", () => {
    const result = groupTransactionsByDate(transactions);
    const dates = Object.keys(result);
    expect(dates[0]).toBe("2024-01-15");
    expect(dates[1]).toBe("2024-01-10");
  });

  it("빈 배열에서도 동작해야 한다", () => {
    const result = groupTransactionsByDate([]);
    expect(Object.keys(result)).toHaveLength(0);
  });
});

describe("calculateMonthSummary", () => {
  const transactions: Transaction[] = [
    {
      id: "1",
      type: "income",
      amount: 3000000,
      categoryId: "salary",
      description: "급여",
      date: "2024-01-15",
      createdAt: "2024-01-15T00:00:00Z",
    },
    {
      id: "2",
      type: "expense",
      amount: 100000,
      categoryId: "food",
      description: "식비",
      date: "2024-01-20",
      createdAt: "2024-01-20T00:00:00Z",
    },
    {
      id: "3",
      type: "expense",
      amount: 50000,
      categoryId: "food",
      description: "외식",
      date: "2024-01-25",
      createdAt: "2024-01-25T00:00:00Z",
    },
    {
      id: "4",
      type: "expense",
      amount: 30000,
      categoryId: "transport",
      description: "교통비",
      date: "2024-02-01",
      createdAt: "2024-02-01T00:00:00Z",
    },
  ];

  it("총 수입을 계산해야 한다", () => {
    const result = calculateMonthSummary(transactions, "2024-01");
    expect(result.totalIncome).toBe(3000000);
  });

  it("총 지출을 계산해야 한다", () => {
    const result = calculateMonthSummary(transactions, "2024-01");
    expect(result.totalExpense).toBe(150000);
  });

  it("잔액을 계산해야 한다", () => {
    const result = calculateMonthSummary(transactions, "2024-01");
    expect(result.balance).toBe(2850000);
  });

  it("카테고리별 금액을 계산해야 한다", () => {
    const result = calculateMonthSummary(transactions, "2024-01");
    expect(result.byCategory["salary"]).toBe(3000000);
    expect(result.byCategory["food"]).toBe(150000);
    expect(result.byCategory["transport"]).toBeUndefined();
  });

  it("거래가 없는 월은 모두 0을 반환해야 한다", () => {
    const result = calculateMonthSummary(transactions, "2024-03");
    expect(result.totalIncome).toBe(0);
    expect(result.totalExpense).toBe(0);
    expect(result.balance).toBe(0);
  });
});
