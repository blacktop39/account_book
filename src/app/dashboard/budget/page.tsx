"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  List,
  Calendar,
  BarChart3,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Tabs } from "@/components/ui/tabs";
import { MonthSummary } from "@/components/budget/month-summary";
import { TransactionList } from "@/components/budget/transaction-list";
import { TransactionForm } from "@/components/budget/transaction-form";
import { CalendarView } from "@/components/budget/calendar-view";
import { useTransactions } from "@/lib/hooks/use-transactions";
import { useCategories } from "@/lib/hooks/use-categories";
import { formatMonth, formatDate } from "@/lib/budget/utils";
import { Transaction, TransactionType } from "@/lib/budget/types";

type ViewMode = "list" | "calendar";

export default function BudgetPage() {
  const {
    monthTransactions,
    groupedTransactions,
    summary,
    currentMonth,
    goToPrevMonth,
    goToNextMonth,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    isLoading: transactionsLoading,
  } = useTransactions();

  const {
    incomeCategories,
    expenseCategories,
    isLoading: categoriesLoading,
  } = useCategories();

  const isLoading = transactionsLoading || categoriesLoading;

  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [modalType, setModalType] = useState<TransactionType | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  const handleAddTransaction = (data: {
    type: TransactionType;
    amount: number;
    categoryId: string;
    description: string;
    date: string;
  }) => {
    addTransaction(data);
    setModalType(null);
  };

  const handleEditTransaction = (data: {
    type: TransactionType;
    amount: number;
    categoryId: string;
    description: string;
    date: string;
  }) => {
    if (editingTransaction) {
      updateTransaction(editingTransaction.id, data);
      setEditingTransaction(null);
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  // 선택된 날짜의 거래 필터링
  const selectedDateTransactions = selectedDate
    ? monthTransactions.filter((t) => t.date === selectedDate)
    : [];

  const selectedDateGrouped = selectedDate
    ? { [selectedDate]: selectedDateTransactions }
    : {};

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-white border-t-transparent rounded-full" />
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">대시보드</span>
          </Link>

          <Link href="/dashboard/budget/stats">
            <Button variant="ghost" size="sm">
              <BarChart3 className="w-4 h-4 mr-2" />
              통계
            </Button>
          </Link>
        </header>

        {/* Month Navigation */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <button
            onClick={goToPrevMonth}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold min-w-[140px] text-center">
            {formatMonth(currentMonth)}
          </h1>
          <button
            onClick={goToNextMonth}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Month Summary */}
        <MonthSummary summary={summary} className="mb-6" />

        {/* Add Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Button
            variant="secondary"
            onClick={() => setModalType("income")}
            className="justify-center"
          >
            <Plus className="w-4 h-4 mr-2 text-[var(--success)]" />
            수입 추가
          </Button>
          <Button
            variant="secondary"
            onClick={() => setModalType("expense")}
            className="justify-center"
          >
            <Minus className="w-4 h-4 mr-2 text-[var(--error)]" />
            지출 추가
          </Button>
        </div>

        {/* View Tabs */}
        <Tabs
          tabs={[
            { id: "list", label: "목록", icon: <List className="w-4 h-4" /> },
            {
              id: "calendar",
              label: "캘린더",
              icon: <Calendar className="w-4 h-4" />,
            },
          ]}
          activeTab={viewMode}
          onChange={(id) => {
            setViewMode(id as ViewMode);
            setSelectedDate(null);
          }}
          className="mb-6"
        />

        {/* Content */}
        {viewMode === "list" ? (
          <TransactionList
            groupedTransactions={groupedTransactions}
            onEdit={handleEdit}
            onDelete={deleteTransaction}
          />
        ) : (
          <div className="space-y-6">
            <CalendarView
              month={currentMonth}
              transactions={monthTransactions}
              selectedDate={selectedDate || undefined}
              onDateSelect={(date) =>
                setSelectedDate(date === selectedDate ? null : date)
              }
            />

            {selectedDate && (
              <div>
                <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-3">
                  {formatDate(selectedDate)}
                </h3>
                {selectedDateTransactions.length > 0 ? (
                  <TransactionList
                    groupedTransactions={selectedDateGrouped}
                    onEdit={handleEdit}
                    onDelete={deleteTransaction}
                  />
                ) : (
                  <div className="py-8 text-center bg-[var(--surface)] border border-[var(--border)] rounded-xl">
                    <p className="text-[var(--text-muted)]">
                      이 날짜에 거래 내역이 없습니다
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Add Transaction Modal */}
        <Modal
          isOpen={modalType !== null}
          onClose={() => setModalType(null)}
          title={modalType === "income" ? "수입 추가" : "지출 추가"}
        >
          {modalType && (
            <TransactionForm
              type={modalType}
              onSubmit={handleAddTransaction}
              onCancel={() => setModalType(null)}
              categories={modalType === "income" ? incomeCategories : expenseCategories}
            />
          )}
        </Modal>

        {/* Edit Transaction Modal */}
        <Modal
          isOpen={editingTransaction !== null}
          onClose={() => setEditingTransaction(null)}
          title="거래 수정"
        >
          {editingTransaction && (
            <TransactionForm
              type={editingTransaction.type}
              onSubmit={handleEditTransaction}
              onCancel={() => setEditingTransaction(null)}
              initialData={{
                amount: editingTransaction.amount,
                categoryId: editingTransaction.categoryId,
                description: editingTransaction.description,
                date: editingTransaction.date,
              }}
              mode="edit"
              categories={editingTransaction.type === "income" ? incomeCategories : expenseCategories}
            />
          )}
        </Modal>
      </div>
    </main>
  );
}
