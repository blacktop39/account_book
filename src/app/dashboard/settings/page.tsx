"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Tabs } from "@/components/ui/tabs";
import { CategoryForm } from "@/components/settings/category-form";
import { CategoryItem } from "@/components/settings/category-item";
import { useCategories, Category } from "@/lib/hooks/use-categories";
import { TransactionType } from "@/lib/budget/types";

type CategoryTab = "income" | "expense";

export default function SettingsPage() {
  const {
    incomeCategories,
    expenseCategories,
    isLoading,
    addCategory,
    updateCategory,
    deleteCategory,
  } = useCategories();

  const [activeTab, setActiveTab] = useState<CategoryTab>("expense");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [addingSubTo, setAddingSubTo] = useState<Category | null>(null);

  const categories = activeTab === "income" ? incomeCategories : expenseCategories;

  const handleAddCategory = async (data: {
    name: string;
    icon: string;
    color: string;
    type?: TransactionType;
    parentId?: string;
  }) => {
    const result = await addCategory({
      ...data,
      type: data.type || activeTab,
    });
    if (result.success) {
      setIsAddModalOpen(false);
    } else {
      alert(result.error);
    }
  };

  const handleAddSubCategory = async (data: {
    name: string;
    icon: string;
    color: string;
  }) => {
    if (!addingSubTo) return;

    const result = await addCategory({
      ...data,
      parentId: addingSubTo.id,
    });
    if (result.success) {
      setAddingSubTo(null);
    } else {
      alert(result.error);
    }
  };

  const handleUpdateCategory = async (data: {
    name: string;
    icon: string;
    color: string;
    type: TransactionType;
  }) => {
    if (!editingCategory) return;

    const result = await updateCategory(editingCategory.id, {
      name: data.name,
      icon: data.icon,
      color: data.color,
    });

    if (result.success) {
      setEditingCategory(null);
    } else {
      alert(result.error);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("이 카테고리를 삭제하시겠습니까?")) return;

    const result = await deleteCategory(id);
    if (!result.success) {
      alert(result.error);
    }
  };

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
        <header className="flex items-center justify-between mb-8">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">대시보드</span>
          </Link>
        </header>

        <h1 className="text-2xl font-bold mb-6">설정</h1>

        {/* Category Section */}
        <section className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">카테고리 관리</h2>
            <Button size="sm" onClick={() => setIsAddModalOpen(true)}>
              <Plus className="w-4 h-4 mr-1" />
              추가
            </Button>
          </div>

          {/* Tabs */}
          <Tabs
            tabs={[
              {
                id: "expense",
                label: "지출",
                icon: <TrendingDown className="w-4 h-4" />,
              },
              {
                id: "income",
                label: "수입",
                icon: <TrendingUp className="w-4 h-4" />,
              },
            ]}
            activeTab={activeTab}
            onChange={(id) => setActiveTab(id as CategoryTab)}
            className="mb-4"
          />

          {/* Category List */}
          <div className="divide-y divide-[var(--border)]">
            {categories.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-[var(--text-muted)]">
                  카테고리가 없습니다
                </p>
              </div>
            ) : (
              categories.map((category) => (
                <div key={category.id}>
                  {/* 1차 카테고리 */}
                  <CategoryItem
                    category={category}
                    onEdit={setEditingCategory}
                    onDelete={handleDeleteCategory}
                    onAddSub={() => setAddingSubTo(category)}
                  />
                  {/* 서브카테고리 */}
                  {category.children?.map((child) => (
                    <div key={child.id} className="pl-8 bg-white/2">
                      <CategoryItem
                        category={child}
                        onEdit={setEditingCategory}
                        onDelete={handleDeleteCategory}
                        isSubCategory
                      />
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </section>

        {/* Add Modal */}
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title={`${activeTab === "income" ? "수입" : "지출"} 카테고리 추가`}
        >
          <CategoryForm
            type={activeTab}
            onSubmit={handleAddCategory}
            onCancel={() => setIsAddModalOpen(false)}
          />
        </Modal>

        {/* Add Sub Category Modal */}
        <Modal
          isOpen={addingSubTo !== null}
          onClose={() => setAddingSubTo(null)}
          title={`"${addingSubTo?.name}" 서브카테고리 추가`}
        >
          {addingSubTo && (
            <CategoryForm
              type={addingSubTo.type}
              onSubmit={handleAddSubCategory}
              onCancel={() => setAddingSubTo(null)}
              hideType
            />
          )}
        </Modal>

        {/* Edit Modal */}
        <Modal
          isOpen={editingCategory !== null}
          onClose={() => setEditingCategory(null)}
          title="카테고리 수정"
        >
          {editingCategory && (
            <CategoryForm
              type={editingCategory.type}
              onSubmit={handleUpdateCategory}
              onCancel={() => setEditingCategory(null)}
              initialData={{
                name: editingCategory.name,
                icon: editingCategory.icon,
                color: editingCategory.color,
              }}
              mode="edit"
            />
          )}
        </Modal>
      </div>
    </main>
  );
}
