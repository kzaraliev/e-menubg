"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import CategoryList from "./CategoryList";
import ProductList from "./ProductList";
import CategoryForm from "./CategoryForm";
import ProductForm from "./ProductForm";

export default function MenuManager({ restaurant, initialCategories, initialProducts }) {
  const [categories, setCategories] = useState(initialCategories || []);
  const [products, setProducts] = useState(initialProducts || []);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Debug logging
  console.log("MenuManager received restaurant:", restaurant);

  // Set first category as selected if none selected
  useEffect(() => {
    if (!selectedCategory && categories.length > 0) {
      setSelectedCategory(categories[0]);
    }
  }, [categories, selectedCategory]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`/api/categories?restaurantId=${restaurant._id}`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchProducts = async (categoryId = null) => {
    try {
      const url = categoryId 
        ? `/api/products?categoryId=${categoryId}`
        : `/api/products?restaurantId=${restaurant._id}`;
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleCreateCategory = async (categoryData) => {
    setIsLoading(true);
    
    // Safety check
    if (!restaurant?._id) {
      toast.error("Липсва ID на ресторанта. Моля, обновете страницата и опитайте отново.");
      setIsLoading(false);
      return;
    }
    
    if (!categoryData?.name?.trim()) {
      toast.error("Името на категорията е задължително.");
      setIsLoading(false);
      return;
    }
    
    try {
      // Debug logging
      console.log("Category Data:", categoryData);
      console.log("Restaurant ID:", restaurant._id);
      console.log("Full payload:", {
        ...categoryData,
        restaurantId: restaurant._id,
      });

      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...categoryData,
          restaurantId: restaurant._id,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create category");
      }

      const newCategory = await response.json();
      setCategories(prev => [...prev, newCategory]);
      setShowCategoryForm(false);
      toast.success("Категорията бе създадена успешно!");
      
      // Select the new category
      setSelectedCategory(newCategory);
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCategory = async (categoryId, categoryData) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update category");
      }

      const updatedCategory = await response.json();
      setCategories(prev => 
        prev.map(cat => cat._id === categoryId ? updatedCategory : cat)
      );
      setEditingCategory(null);
      setShowCategoryForm(false);
      toast.success("Категорията бе обновена успешно!");
      
      // Update selected category if it was being edited
      if (selectedCategory?._id === categoryId) {
        setSelectedCategory(updatedCategory);
      }
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!confirm("Are you sure you want to delete this category? All products in this category will also be deleted.")) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete category");
      }

      setCategories(prev => prev.filter(cat => cat._id !== categoryId));
      setProducts(prev => prev.filter(prod => prod.categoryId !== categoryId));
      
      // Select another category if the deleted one was selected
      if (selectedCategory?._id === categoryId) {
        const remainingCategories = categories.filter(cat => cat._id !== categoryId);
        setSelectedCategory(remainingCategories.length > 0 ? remainingCategories[0] : null);
      }
      
      toast.success("Category and all products deleted successfully!");
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProduct = async (productData) => {
    setIsLoading(true);
    
    // Safety checks
    if (!restaurant?._id) {
      toast.error("Restaurant ID is missing. Please refresh the page and try again.");
      setIsLoading(false);
      return;
    }
    
    if (!selectedCategory?._id) {
      toast.error("Please select a category first.");
      setIsLoading(false);
      return;
    }
    
    if (!productData?.name?.trim()) {
      toast.error("Product name is required.");
      setIsLoading(false);
      return;
    }
    
    if (!productData?.priceBGN || productData.priceBGN <= 0) {
      toast.error("Valid price is required.");
      setIsLoading(false);
      return;
    }
    
    try {
      // Debug logging
      console.log("Product Data:", productData);
      console.log("Selected Category ID:", selectedCategory._id);
      console.log("Restaurant ID:", restaurant._id);
      console.log("Full product payload:", {
        ...productData,
        categoryId: selectedCategory._id,
        restaurantId: restaurant._id,
      });

      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...productData,
          categoryId: selectedCategory._id,
          restaurantId: restaurant._id,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create product");
      }

      const newProduct = await response.json();
      setProducts(prev => [...prev, newProduct]);
      setShowProductForm(false);
      toast.success("Product created successfully!");
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProduct = async (productId, productData) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update product");
      }

      const updatedProduct = await response.json();
      setProducts(prev => 
        prev.map(prod => prod._id === productId ? updatedProduct : prod)
      );
      setEditingProduct(null);
      setShowProductForm(false);
      toast.success("Product updated successfully!");
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete product");
      }

      setProducts(prev => prev.filter(prod => prod._id !== productId));
      toast.success("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const categoryProducts = products.filter(product => 
    selectedCategory ? product.categoryId === selectedCategory._id : false
  );

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <div className="flex gap-4">
          <button
            onClick={() => {
              setEditingCategory(null);
              setShowCategoryForm(true);
            }}
            className="btn btn-primary"
          >
            Add Category
          </button>
          
          {selectedCategory && (
            <button
              onClick={() => {
                setEditingProduct(null);
                setShowProductForm(true);
              }}
              className="btn btn-secondary"
            >
              Add Product
            </button>
          )}
        </div>
        
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Categories</div>
            <div className="stat-value text-lg">{categories.length}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Products</div>
            <div className="stat-value text-lg">{products.length}</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1">
          <CategoryList
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onEditCategory={(category) => {
              setEditingCategory(category);
              setShowCategoryForm(true);
            }}
            onDeleteCategory={handleDeleteCategory}
            isLoading={isLoading}
          />
        </div>

        {/* Products Main Area */}
        <div className="lg:col-span-2">
          {selectedCategory ? (
            <ProductList
              category={selectedCategory}
              products={categoryProducts}
              onEditProduct={(product) => {
                setEditingProduct(product);
                setShowProductForm(true);
              }}
              onDeleteProduct={handleDeleteProduct}
              restaurantSettings={restaurant.settings}
              isLoading={isLoading}
            />
          ) : (
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body text-center">
                <h3 className="text-xl font-semibold">No Categories Yet</h3>
                <p className="text-base-content/70">
                  Create your first category to start building your menu.
                </p>
                <button
                  onClick={() => {
                    setEditingCategory(null);
                    setShowCategoryForm(true);
                  }}
                  className="btn btn-primary mx-auto"
                >
                  Create First Category
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Category Form Modal */}
      {showCategoryForm && (
        <CategoryForm
          category={editingCategory}
          onSave={editingCategory ? 
            (data) => handleUpdateCategory(editingCategory._id, data) : 
            handleCreateCategory
          }
          onCancel={() => {
            setShowCategoryForm(false);
            setEditingCategory(null);
          }}
          isLoading={isLoading}
        />
      )}

      {/* Product Form Modal */}
      {showProductForm && selectedCategory && (
        <ProductForm
          product={editingProduct}
          category={selectedCategory}
          onSave={editingProduct ? 
            (data) => handleUpdateProduct(editingProduct._id, data) : 
            handleCreateProduct
          }
          onCancel={() => {
            setShowProductForm(false);
            setEditingProduct(null);
          }}
          restaurantSettings={restaurant.settings}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}