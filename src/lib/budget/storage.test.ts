import { describe, it, expect, beforeEach } from "vitest";
import {
  getBudgetData,
  saveBudgetData,
  addTransaction,
  deleteTransaction,
  updateTransaction,
} from "./storage";
import { Transaction, BudgetData } from "./types";

describe("storage", () => {
  const mockTransaction: Transaction = {
    id: "test-1",
    type: "income",
    amount: 100000,
    categoryId: "salary",
    description: "테스트 급여",
    date: "2024-01-15",
    createdAt: "2024-01-15T00:00:00Z",
  };

  describe("getBudgetData", () => {
    it("LocalStorage가 비어있으면 빈 데이터를 반환해야 한다", () => {
      const data = getBudgetData();
      expect(data.transactions).toHaveLength(0);
      expect(data.version).toBe(1);
    });

    it("저장된 데이터를 반환해야 한다", () => {
      const savedData: BudgetData = {
        transactions: [mockTransaction],
        version: 1,
      };
      localStorage.setItem("budget-data", JSON.stringify(savedData));

      const data = getBudgetData();
      expect(data.transactions).toHaveLength(1);
      expect(data.transactions[0].id).toBe("test-1");
    });

    it("잘못된 JSON이면 빈 데이터를 반환해야 한다", () => {
      localStorage.setItem("budget-data", "invalid json");

      const data = getBudgetData();
      expect(data.transactions).toHaveLength(0);
    });
  });

  describe("saveBudgetData", () => {
    it("데이터를 LocalStorage에 저장해야 한다", () => {
      const data: BudgetData = {
        transactions: [mockTransaction],
        version: 1,
      };

      saveBudgetData(data);

      const saved = localStorage.getItem("budget-data");
      expect(saved).not.toBeNull();
      const parsed = JSON.parse(saved!);
      expect(parsed.transactions).toHaveLength(1);
    });
  });

  describe("addTransaction", () => {
    it("새 거래를 추가해야 한다", () => {
      const result = addTransaction(mockTransaction);

      expect(result.transactions).toHaveLength(1);
      expect(result.transactions[0].id).toBe("test-1");
    });

    it("기존 거래에 추가해야 한다", () => {
      // 첫 번째 거래 추가
      addTransaction(mockTransaction);

      // 두 번째 거래 추가
      const newTransaction: Transaction = {
        ...mockTransaction,
        id: "test-2",
        amount: 50000,
      };
      const result = addTransaction(newTransaction);

      expect(result.transactions).toHaveLength(2);
    });

    it("LocalStorage에 저장해야 한다", () => {
      addTransaction(mockTransaction);

      const saved = localStorage.getItem("budget-data");
      expect(saved).not.toBeNull();
      const parsed = JSON.parse(saved!);
      expect(parsed.transactions).toHaveLength(1);
    });
  });

  describe("deleteTransaction", () => {
    beforeEach(() => {
      // 테스트용 거래 추가
      const data: BudgetData = {
        transactions: [
          mockTransaction,
          { ...mockTransaction, id: "test-2" },
        ],
        version: 1,
      };
      localStorage.setItem("budget-data", JSON.stringify(data));
    });

    it("ID로 거래를 삭제해야 한다", () => {
      const result = deleteTransaction("test-1");

      expect(result.transactions).toHaveLength(1);
      expect(result.transactions[0].id).toBe("test-2");
    });

    it("존재하지 않는 ID는 무시해야 한다", () => {
      const result = deleteTransaction("non-existent");

      expect(result.transactions).toHaveLength(2);
    });

    it("LocalStorage에 저장해야 한다", () => {
      deleteTransaction("test-1");

      const saved = localStorage.getItem("budget-data");
      const parsed = JSON.parse(saved!);
      expect(parsed.transactions).toHaveLength(1);
    });
  });

  describe("updateTransaction", () => {
    beforeEach(() => {
      const data: BudgetData = {
        transactions: [mockTransaction],
        version: 1,
      };
      localStorage.setItem("budget-data", JSON.stringify(data));
    });

    it("거래를 업데이트해야 한다", () => {
      const result = updateTransaction("test-1", { amount: 200000 });

      expect(result.transactions[0].amount).toBe(200000);
      expect(result.transactions[0].description).toBe("테스트 급여"); // 다른 필드 유지
    });

    it("여러 필드를 업데이트해야 한다", () => {
      const result = updateTransaction("test-1", {
        amount: 300000,
        description: "수정된 설명",
      });

      expect(result.transactions[0].amount).toBe(300000);
      expect(result.transactions[0].description).toBe("수정된 설명");
    });

    it("존재하지 않는 ID는 무시해야 한다", () => {
      const result = updateTransaction("non-existent", { amount: 999 });

      expect(result.transactions[0].amount).toBe(100000); // 원래 값 유지
    });

    it("LocalStorage에 저장해야 한다", () => {
      updateTransaction("test-1", { amount: 500000 });

      const saved = localStorage.getItem("budget-data");
      const parsed = JSON.parse(saved!);
      expect(parsed.transactions[0].amount).toBe(500000);
    });
  });
});
