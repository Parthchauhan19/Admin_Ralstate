import { useState, useEffect } from "react";
import {
  TrendingUp,
  DollarSign,
  CreditCard,
  Home,
  Filter,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  Loader,
  Plus,
  Edit,
  Trash2,
  X,
  Info,
  AlertTriangle,
} from "lucide-react";
import Demorampe from "./Demorampe";


const API_URL = "http://localhost:8000/";

function App() {
  const [selectedPeriod, setSelectedPeriod] = useState("30days");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [formData, setFormData] = useState({
    buyer: "",
    propertyTitle: "",
    propertyId: "",
    type: "Sale",
    amount: "",
    commission: "",
    status: "Completed",
    paymentMethod: "Cash",
    date: new Date().toISOString().split("T")[0],
  });


  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("info");

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(null); 

  useEffect(() => {
    fetchTransactions();
  }, []);


  const showCustomAlert = (message, type = "info") => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlertModal(true);
  };

  const showCustomConfirm = (message, action) => {
    setConfirmMessage(message);
    setConfirmAction(() => action);
    setShowConfirmModal(true);
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}transactions/getAll`);
      if (response.ok) {
        const data = await response.json();
        setRecentTransactions(data);
      } else {
        console.error("Failed to fetch transactions:", response.statusText);
        setRecentTransactions([]);
        showCustomAlert(
          `Failed to fetch transactions: ${response.statusText}`,
          "error"
        );
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setRecentTransactions([]);
      showCustomAlert(`Error fetching transactions: ${error.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const generateTransactionId = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    return `TXID-${timestamp}-${random}`;
  };

  const handleAddTransactions = async (e) => {
    e.preventDefault();
    try {
      const transactionData = {
        ...formData,
        transactionId: generateTransactionId(),
        amount: Number(formData.amount),
        commission: Number(formData.commission),
      };

      const response = await fetch(`${API_URL}transactions/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transactionData),
      });

      if (response.ok) {
        await fetchTransactions();
        setShowAddModal(false);
        resetForm();
        showCustomAlert("Transaction added successfully!", "success");
      } else {
        const errorData = await response.json();
        console.error("Failed to add transaction:", errorData);
        showCustomAlert(
          `Failed to add transaction: ${errorData.message || "Unknown error"}`,
          "error"
        );
      }
    } catch (error) {
      console.error("Error adding transaction:", error);
      showCustomAlert(`Error adding transaction: ${error.message}`, "error");
    }
  };

  const handleEditTransactions = async (e) => {
    e.preventDefault();
    try {
      if (!currentTransaction || !currentTransaction.transactionId) {
        console.error("No transaction selected for editing");
        showCustomAlert("No transaction selected for editing.", "error");
        return;
      }

      const updateData = {
        ...formData,
        amount: Number(formData.amount),
        commission: Number(formData.commission),
      };

      const response = await fetch(
        `${API_URL}transactions/update/${currentTransaction.transactionId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );

      if (response.ok) {
        await fetchTransactions();
        setShowEditModal(false);
        setCurrentTransaction(null);
        resetForm();
        showCustomAlert("Transaction updated successfully!", "success");
      } else {
        const errorData = await response.json();
        console.error("Failed to update transaction:", errorData);
        showCustomAlert(
          `Failed to update transaction: ${
            errorData.message || "Unknown error"
          }`,
          "error"
        );
      }
    } catch (error) {
      console.error("Error updating transaction:", error);
      showCustomAlert(`Error updating transaction: ${error.message}`, "error");
    }
  };

  const handleDeleteTransactions = async (transactionId) => {
    showCustomConfirm(
      "Are you sure you want to delete this transaction?",
      async () => {
        try {
          const response = await fetch(
            `${API_URL}transactions/delete/${transactionId}`,
            {
              method: "DELETE",
            }
          );

          if (response.ok) {
            await fetchTransactions();
            showCustomAlert("Transaction deleted successfully!", "success");
          } else {
            const errorData = await response.json();
            console.error("Failed to delete transaction:", errorData);
            showCustomAlert(
              `Failed to delete transaction: ${
                errorData.message || "Unknown error"
              }`,
              "error"
            );
          }
        } catch (error) {
          console.error("Error deleting transaction:", error);
          showCustomAlert(
            `Error deleting transaction: ${error.message}`,
            "error"
          );
        }
      }
    );
  };

  const resetForm = () => {
    setFormData({
      buyer: "",
      propertyTitle: "",
      propertyId: "",
      type: "Sale",
      amount: "",
      commission: "",
      status: "Completed",
      paymentMethod: "Cash",
      date: new Date().toISOString().split("T")[0],
    });
  };

  const openEditModal = (transaction) => {
    if (!transaction) return;

    setCurrentTransaction(transaction);
    setFormData({
      buyer: transaction.buyer || "",
      propertyTitle: transaction.propertyTitle || "",
      propertyId: transaction.propertyId || "",
      type: transaction.type || "Sale",
      amount: transaction.amount?.toString() || "",
      commission: transaction.commission?.toString() || "",
      status: transaction.status || "Completed",
      paymentMethod: transaction.paymentMethod || "Cash",
      date: transaction.date
        ? new Date(transaction.date).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
    });

    setShowEditModal(true);
  };

  const calculateDashboardData = () => {
    const completedTransactions = recentTransactions.filter(
      (t) => t.status === "Completed"
    );
    const pendingTransactions = recentTransactions.filter(
      (t) => t.status === "Pending"
    );
    const failedTransactions = recentTransactions.filter(
      (t) => t.status === "Failed"
    );

    const totalRevenue = completedTransactions.reduce(
      (sum, t) => sum + (t.amount || 0),
      0
    );
    const totalCommission = completedTransactions.reduce(
      (sum, t) => sum + (t.commission || 0),
      0
    );

    return {
      totalSales: recentTransactions.length,
      totalRevenue: totalRevenue,
      commission: totalCommission,
      pendingPayments: pendingTransactions.length,
      completedPayments: completedTransactions.length,
      failedPayments: failedTransactions.length,
    };
  };

  const dashboardData = calculateDashboardData();

  // This data is static in your original code, so keeping it as is.
  const paymentMethodStats = [
    { method: "Cash", count: 35, percentage: 35 },
    { method: "UPI", count: 25, percentage: 25 },
    { method: "Bank Transfer", count: 20, percentage: 20 },
    { method: "Google Pay", count: 15, percentage: 15 },
    { method: "PhonePe", count: 5, percentage: 5 },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "Pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "Failed":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "Sale":
        return "bg-blue-100 text-blue-800";
      case "Rent":
        return "bg-purple-100 text-purple-800";
      case "Buy":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleCloseModal = (isEdit = false) => {
    if (isEdit) {
      setShowEditModal(false);
      setCurrentTransaction(null);
    } else {
      setShowAddModal(false);
    }
    resetForm();
  };

  const CustomAlertModal = ({ message, type, onClose }) => {
    let icon;
    let bgColor;
    let textColor;
    switch (type) {
      case "success":
        icon = <CheckCircle className="w-6 h-6 text-green-600" />;
        bgColor = "bg-green-100";
        textColor = "text-green-800";
        break;
      case "error":
        icon = <XCircle className="w-6 h-6 text-red-600" />;
        bgColor = "bg-red-100";
        textColor = "text-red-800";
        break;
      case "info":
      default:
        icon = <Info className="w-6 h-6 text-blue-600" />;
        bgColor = "bg-blue-100";
        textColor = "text-blue-800";
        break;
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm relative">
          <div
            className={`flex items-center gap-3 mb-4 ${bgColor} p-3 rounded-lg`}
          >
            {icon}
            <span className={`font-semibold ${textColor}`}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </span>
          </div>
          <p className="text-gray-700 mb-6">{message}</p>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    );
  };

  const CustomConfirmModal = ({ message, onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm relative">
        <div className="flex items-center gap-3 mb-4 bg-yellow-100 p-3 rounded-lg">
          <AlertTriangle className="w-6 h-6 text-yellow-600" />
          <span className="font-semibold text-yellow-800">Confirmation</span>
        </div>
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );

  const AddTransactionModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => handleCloseModal(false)}
          className="absolute top-4 right-4 p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold mb-6 text-gray-900">
          Add New Transaction
        </h2>
        <form onSubmit={handleAddTransactions} className="space-y-4">
          <div>
            <label
              htmlFor="buyer"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Buyer Name *
            </label>
            <input
              type="text"
              id="buyer"
              name="buyer"
              value={formData.buyer}
              onChange={handleInputChange}
              placeholder="Enter buyer name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="propertyTitle"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Property Title *
              </label>
              <input
                type="text"
                id="propertyTitle"
                name="propertyTitle"
                value={formData.propertyTitle}
                onChange={handleInputChange}
                placeholder="Enter property title"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label
                htmlFor="propertyId"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Property ID *
              </label>
              <input
                type="text"
                id="propertyId"
                name="propertyId"
                value={formData.propertyId}
                onChange={handleInputChange}
                placeholder="Enter property ID"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Transaction Type *
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              >
                <option value="">Select type</option>
                <option value="Sale">Sale</option>
                <option value="Rent">Rent</option>
                <option value="Buy">Buy</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Status *
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              >
                <option value="">Select status</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Amount ($) *
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="0.00"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                min="0"
                step="1"
                required
              />
            </div>
            <div>
              <label
                htmlFor="commission"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Commission ($) *
              </label>
              <input
                type="number"
                id="commission"
                name="commission"
                value={formData.commission}
                onChange={handleInputChange}
                placeholder="0.00"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                min="0"
                step="1"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="paymentMethod"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Payment Method *
            </label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            >
              <option value="">Select payment method</option>
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Google Pay">Google Pay</option>
              <option value="PhonePe">PhonePe</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Transaction Date *
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => handleCloseModal(false)}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-md"
            >
              Add Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const EditTransactionModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => handleCloseModal(true)}
          className="absolute top-4 right-4 p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold mb-6 text-gray-900">
          Edit Transaction
        </h2>
        <form onSubmit={handleEditTransactions} className="space-y-4">
          <div>
            <label
              htmlFor="editBuyer"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Buyer Name *
            </label>
            <input
              type="text"
              id="editBuyer"
              name="buyer"
              value={formData.buyer}
              onChange={handleInputChange}
              placeholder="Enter buyer name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="editPropertyTitle"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Property Title *
              </label>
              <input
                type="text"
                id="editPropertyTitle"
                name="propertyTitle"
                value={formData.propertyTitle}
                onChange={handleInputChange}
                placeholder="Enter property title"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label
                htmlFor="editPropertyId"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Property ID *
              </label>
              <input
                type="text"
                id="editPropertyId"
                name="propertyId"
                value={formData.propertyId}
                onChange={handleInputChange}
                placeholder="Enter property ID"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="editType"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Transaction Type *
              </label>
              <select
                id="editType"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              >
                <option value="Sale">Sale</option>
                <option value="Rent">Rent</option>
                <option value="Buy">Buy</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="editStatus"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Status *
              </label>
              <select
                id="editStatus"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              >
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="editAmount"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Amount ($) *
              </label>
              <input
                type="number"
                id="editAmount"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="0.00"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                min="0"
                step="1"
                required
              />
            </div>
            <div>
              <label
                htmlFor="editCommission"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Commission ($) *
              </label>
              <input
                type="number"
                id="editCommission"
                name="commission"
                value={formData.commission}
                onChange={handleInputChange}
                placeholder="0.00"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                min="0"
                step="1"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="editPaymentMethod"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Payment Method *
            </label>
            <select
              id="editPaymentMethod"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            >
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Google Pay">Google Pay</option>
              <option value="PhonePe">PhonePe</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="editDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Transaction Date *
            </label>
            <input
              type="date"
              id="editDate"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => handleCloseModal(true)}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-md"
            >
              Update Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex items-center justify-center min-h-96">
        <div className="flex items-center space-x-2">
          <Loader className="animate-spin" size={20} />
          <span>Loading analytics data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      {showAddModal && <AddTransactionModal />}
      {showEditModal && <EditTransactionModal />}
      {showAlertModal && (
        <CustomAlertModal
          message={alertMessage}
          type={alertType}
          onClose={() => setShowAlertModal(false)}
        />
      )}
      {showConfirmModal && (
        <CustomConfirmModal
          message={confirmMessage}
          onConfirm={() => {
            if (confirmAction) confirmAction();
            setShowConfirmModal(false);
            setConfirmAction(null);
          }}
          onCancel={() => {
            setShowConfirmModal(false);
            setConfirmAction(null);
          }}
        />
      )}

      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Sales & Transactions Report
            </h1>
            <p className="text-gray-600">
              Monitor your property sales, rentals, and payment analytics
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-md"
            >
              <Plus className="w-4 h-4" />
              Add Transaction
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-md">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="timePeriod"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Time Period
            </label>
            <select
              id="timePeriod"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
              <option value="90days">Last 90 days</option>
              <option value="1year">Last year</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="paymentMethodFilter"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Payment Method
            </label>
            <select
              id="paymentMethodFilter"
              value={selectedPaymentMethod}
              onChange={(e) => setSelectedPaymentMethod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Methods</option>
              <option value="cash">Cash</option>
              <option value="upi">UPI</option>
              <option value="bank">Bank Transfer</option>
              <option value="digital">Digital Wallet</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="paymentStatusFilter"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Payment Status
            </label>
            <select
              id="paymentStatusFilter"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Properties Sold/Rented
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {dashboardData.totalSales}
              </p>
              <p className="text-sm text-green-600 mt-1">
                +12% from last month
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Home className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900">
                ${dashboardData.totalRevenue.toLocaleString()}
              </p>
              <p className="text-sm text-green-600 mt-1">+8% from last month</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Commission Earned
              </p>
              <p className="text-3xl font-bold text-gray-900">
                ${dashboardData.commission.toLocaleString()}
              </p>
              <p className="text-sm text-green-600 mt-1">
                +15% from last month
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-orange-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Pending Payments
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {dashboardData.pendingPayments}
              </p>
              <p className="text-sm text-yellow-600 mt-1">Requires attention</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Payment Status Distribution
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">Completed</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold text-gray-900">
                  {dashboardData.completedPayments}
                </span>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{
                      width: `${
                        recentTransactions.length > 0
                          ? (dashboardData.completedPayments /
                              recentTransactions.length) *
                            100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-yellow-500" />
                <span className="text-gray-700">Pending</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold text-gray-900">
                  {dashboardData.pendingPayments}
                </span>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{
                      width: `${
                        recentTransactions.length > 0
                          ? (dashboardData.pendingPayments /
                              recentTransactions.length) *
                            100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <XCircle className="w-5 h-5 text-red-500" />
                <span className="text-gray-700">Failed</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold text-gray-900">
                  {dashboardData.failedPayments}
                </span>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{
                      width: `${
                        recentTransactions.length > 0
                          ? (dashboardData.failedPayments /
                              recentTransactions.length) *
                            100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Payment Methods Usage
          </h3>
          <div className="space-y-4">
            {paymentMethodStats.map((method, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-blue-500" />
                  <span className="text-gray-700">{method.method}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">
                    {method.count} ({method.percentage}%)
                  </span>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${method.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Transactions
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            {/* Removed whitespace between table and thead/tbody */}
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commission
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentTransactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center">
                      <Home className="w-12 h-12 text-gray-300 mb-4" />
                      <p className="text-lg font-medium">
                        No transactions found
                      </p>
                      <p className="text-sm">
                        Add your first transaction to get started
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                recentTransactions.map((transaction) => (
                  <tr
                    key={transaction.transactionId || transaction._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {transaction.transactionId}
                        </div>
                        <div className="text-sm text-gray-500">
                          {transaction.buyer}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {transaction.propertyTitle}
                        </div>
                        <div className="text-sm text-gray-500">
                          {transaction.propertyId}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(
                          transaction.type
                        )}`}
                      >
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${transaction.amount?.toLocaleString() || "0"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${transaction.commission?.toLocaleString() || "0"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(transaction.status)}
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            transaction.status
                          )}`}
                        >
                          {transaction.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.paymentMethod}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.date
                        ? new Date(transaction.date).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(transaction)}
                          className="p-1 text-blue-600 hover:text-blue-800 transition-colors rounded-full hover:bg-blue-50"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteTransactions(transaction.transactionId)
                          }
                          className="p-1 text-red-600 hover:text-red-800 transition-colors rounded-full hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-sm text-gray-700">
              Showing 1 to {Math.min(10, recentTransactions.length)} of{" "}
              {recentTransactions.length} transactions
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors shadow-sm">
                Previous
              </button>
              <button className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors shadow-sm">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
      <Demorampe />
    </div>
  );
}

export default App;
