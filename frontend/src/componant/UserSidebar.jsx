import React, { useContext, useState, useEffect } from 'react';
import {
  X,
  User,
  Settings,
  ShoppingCart,
  Heart,
  CreditCard,
  FileText,
  Bell,
  Mail,
  Lock,
  Globe,
  Palette,
  Tag,
  Award,
  HelpCircle,
  MessageCircle,
  Phone,
  LogOut,
  ArrowRight,
  ChevronRight,
  MapPin,
  Building,
  TrendingUp,
  Shield,
  Moon,
  UserCircle,
  Plus,
  Trash2,
  Edit,
  RefreshCw,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { context } from '../Context/StoreContext';
import api from '../api/axios';
import { Modal } from '../components/ui/Modal';

const UserSidebar = ({ setShowLogine, isOpen: propIsOpen, setIsOpen: propSetIsOpen }) => {
  const nav = useNavigate();
  const { token, user, logout, cartItem, wishlist, sarees } = useContext(context);

  const [modalOpen, setModalOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

  // Loading states for dynamic sections
  const [loading, setLoading] = useState({
    addresses: false,
    paymentMethods: false,
    transactions: false,
    refunds: false,
    profile: false,
    password: false,
  });

  // Dynamic data from backend
  const [addresses, setAddresses] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [refunds, setRefunds] = useState([]);

  // Form states
  const [editProfileForm, setEditProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: '',
  });
  const [changePasswordForm, setChangePasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [addressForm, setAddressForm] = useState({
    street: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false,
  });
  const [paymentMethodForm, setPaymentMethodForm] = useState({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    isDefault: false,
  });

  // Toast-like messages
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const totalItem = Object.values(cartItem || {}).reduce((sum, qty) => sum + qty, 0);

  // Count only cart items that have matching products
  const displayableCartCount = Object.keys(cartItem || {}).reduce((count, id) => {
    const product = sarees.find((s) => String(s.id) === id || String(s._id) === id);
    return product ? count + (cartItem[id] || 0) : count;
  }, 0);

  // Count only wishlist items that have matching products
  const displayableWishlistCount = (wishlist || []).reduce((count, s) => {
    const product = sarees.find(
      (sa) => String(sa.id) === String(s._id || s.id || s) || String(sa._id) === String(s._id || s.id || s)
    );
    return product ? count + 1 : count;
  }, 0);

  // ---------------- Fetch dynamic data ----------------

  const fetchAddresses = async () => {
    setLoading((prev) => ({ ...prev, addresses: true }));
    try {
      const res = await api.get('/user/addresses');
      setAddresses(res.data.addresses || []);
      // Sync address text to edit profile form
      if (res.data.addresses && res.data.addresses.length > 0) {
        setEditProfileForm((prev) => ({ ...prev, address: res.data.addresses[0].street || '' }));
      }
    } catch (err) {
      console.error('Fetch addresses error:', err);
      setAddresses([]);
    } finally {
      setLoading((prev) => ({ ...prev, addresses: false }));
    }
  };

  const fetchPaymentMethods = async () => {
    setLoading((prev) => ({ ...prev, paymentMethods: true }));
    try {
      const res = await api.get('/user/payment-methods');
      setPaymentMethods(res.data.paymentMethods || []);
    } catch (err) {
      console.error('Fetch payment methods error:', err);
      setPaymentMethods([]);
    } finally {
      setLoading((prev) => ({ ...prev, paymentMethods: false }));
    }
  };

  const fetchTransactions = async () => {
    setLoading((prev) => ({ ...prev, transactions: true }));
    try {
      const res = await api.get('/user/transactions');
      setTransactions(res.data.transactions || []);
    } catch (err) {
      console.error('Fetch transactions error:', err);
      setTransactions([]);
    } finally {
      setLoading((prev) => ({ ...prev, transactions: false }));
    }
  };

  const fetchRefunds = async () => {
    setLoading((prev) => ({ ...prev, refunds: true }));
    try {
      const res = await api.get('/user/refunds');
      setRefunds(res.data.refunds || []);
    } catch (err) {
      console.error('Fetch refunds error:', err);
      setRefunds([]);
    } finally {
      setLoading((prev) => ({ ...prev, refunds: false }));
    }
  };

  // Fetch dynamic data when modal opens for relevant sections
  useEffect(() => {
    if (activeModal === 'addresses' && modalOpen) fetchAddresses();
    if (activeModal === 'paymentMethods' && modalOpen) fetchPaymentMethods();
    if (activeModal === 'transactions' && modalOpen) fetchTransactions();
    if (activeModal === 'refunds' && modalOpen) fetchRefunds();
  }, [activeModal, modalOpen]);

  useEffect(() => {
    if (propIsOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [propIsOpen]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    if (activeModal === 'orders' && modalOpen && token) {
      fetchOrders();
    }
  }, [activeModal, modalOpen, token]);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await api.get('/orders/userorders');
      setOrders(res.data.data || []);
    } catch (err) {
      console.error('Fetch orders error:', err);
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  // ---------------- Handlers ----------------

  const openModal = (key) => {
    propSetIsOpen(false);
    setActiveModal(key);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setActiveModal(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      // Backend may return 500 if no active session — clear local state anyway
      console.error('Backend logout error:', err);
    }
    // Always clear local state and redirect
    propSetIsOpen(false);
    closeModal();
    nav('/');
  };

  // ---------------- Edit Profile ----------------

  const handleEditProfileChange = (e) => {
    const { name, value } = e.target;
    setEditProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressFormChange = (e) => {
    const { name, value } = e.target;
    setAddressForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentMethodFormChange = (e) => {
    const { name, value } = e.target;
    setPaymentMethodForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading((prev) => ({ ...prev, profile: true }));
    try {
      const res = await api.put('/user/profile', {
        name: editProfileForm.name,
        phone: editProfileForm.phone,
        address: editProfileForm.address,
      });
      if (res.data.success) {
        showToast('Profile updated successfully!');
        // Update context user
        const updatedUser = { ...user, name: editProfileForm.name, phone: editProfileForm.phone };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        closeModal();
      } else {
        showToast(res.data.message || 'Update failed', 'error');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Update failed', 'error');
    } finally {
      setLoading((prev) => ({ ...prev, profile: false }));
    }
  };

  // ---------------- Change Password ----------------

  const handleChangePasswordChange = (e) => {
    const { name, value } = e.target;
    setChangePasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    if (changePasswordForm.newPassword !== changePasswordForm.confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }
    setLoading((prev) => ({ ...prev, password: true }));
    try {
      const res = await api.put('/user/change-password', {
        currentPassword: changePasswordForm.currentPassword,
        newPassword: changePasswordForm.newPassword,
      });
      if (res.data.success) {
        showToast('Password changed successfully!');
        closeModal();
        setChangePasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        showToast(res.data.message || 'Password change failed', 'error');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Password change failed', 'error');
    } finally {
      setLoading((prev) => ({ ...prev, password: false }));
    }
  };

  // ---------------- Addresses ----------------

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setLoading((prev) => ({ ...prev, addresses: true }));
    try {
      const res = await api.post('/user/addresses', {
        street: addressForm.street,
        city: addressForm.city,
        state: addressForm.state,
        pincode: addressForm.pincode,
        isDefault: addressForm.isDefault,
      });
      if (res.data.success) {
        setAddresses(res.data.addresses || []);
        showToast('Address added successfully!');
        setAddressForm({ street: '', city: '', state: '', pincode: '', isDefault: false });
      } else {
        showToast(res.data.message || 'Failed to add address', 'error');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to add address', 'error');
    } finally {
      setLoading((prev) => ({ ...prev, addresses: false }));
    }
  };

  const handleRemoveAddress = async (addressId) => {
    if (!window.confirm('Are you sure you want to remove this address?')) return;
    setLoading((prev) => ({ ...prev, addresses: true }));
    try {
      const res = await api.delete(`/user/addresses/${addressId}`);
      if (res.data.success) {
        setAddresses(res.data.addresses || []);
        showToast('Address removed successfully!');
      } else {
        showToast(res.data.message || 'Failed to remove address', 'error');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to remove address', 'error');
    } finally {
      setLoading((prev) => ({ ...prev, addresses: false }));
    }
  };

  // ---------------- Payment Methods ----------------

  const handleAddPaymentMethod = async (e) => {
    e.preventDefault();
    setLoading((prev) => ({ ...prev, paymentMethods: true }));
    try {
      const res = await api.post('/user/payment-methods', {
        cardName: paymentMethodForm.cardName,
        cardNumber: paymentMethodForm.cardNumber,
        expiry: paymentMethodForm.expiry,
        cvv: paymentMethodForm.cvv,
        isDefault: paymentMethodForm.isDefault,
      });
      if (res.data.success) {
        setPaymentMethods(res.data.paymentMethods || []);
        showToast('Payment method added successfully!');
        setPaymentMethodForm({ cardName: '', cardNumber: '', expiry: '', cvv: '', isDefault: false });
      } else {
        showToast(res.data.message || 'Failed to add payment method', 'error');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to add payment method', 'error');
    } finally {
      setLoading((prev) => ({ ...prev, paymentMethods: false }));
    }
  };

  const handleRemovePaymentMethod = async (methodId) => {
    if (!window.confirm('Are you sure you want to remove this payment method?')) return;
    setLoading((prev) => ({ ...prev, paymentMethods: true }));
    try {
      const res = await api.delete(`/user/payment-methods/${methodId}`);
      if (res.data.success) {
        setPaymentMethods(res.data.paymentMethods || []);
        showToast('Payment method removed successfully!');
      } else {
        showToast(res.data.message || 'Failed to remove payment method', 'error');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to remove payment method', 'error');
    } finally {
      setLoading((prev) => ({ ...prev, paymentMethods: false }));
    }
  };

  const modalTitles = {
    profile: 'My Profile',
    orders: 'My Orders',
    wishlist: 'My Wishlist',
    cart: 'Shopping Cart',
    addresses: 'Saved Addresses',
    paymentMethods: 'Payment Methods',
    transactions: 'Transactions',
    refunds: 'Refunds',
    notifications: 'Notifications',
    emailPreferences: 'Email Preferences',
    changePassword: 'Change Password',
    privacySecurity: 'Privacy & Security',
    language: 'Language',
    appearance: 'Appearance',
    coupons: 'Coupons',
    loyaltyPoints: 'Loyalty Points',
    helpCenter: 'Help Center',
    contactSupport: 'Contact Support',
    faqs: 'FAQs',
  };

  const menuSections = [
    {
      title: 'SHOPPING',
      items: [
        { key: 'orders', label: 'My Orders', icon: FileText },
        { key: 'wishlist', label: 'Wishlist', icon: Heart },
        { key: 'cart', label: 'Cart', icon: ShoppingCart },
        { key: 'addresses', label: 'Saved Addresses', icon: MapPin },
        { key: 'logout', label: 'Logout', icon: LogOut, variant: 'danger' },
      ],
    },
    {
      title: 'PAYMENTS',
      items: [
        { key: 'paymentMethods', label: 'Payment Methods', icon: CreditCard },
        { key: 'transactions', label: 'Transactions', icon: TrendingUp },
        { key: 'refunds', label: 'Refunds', icon: Mail },
      ],
    },
    {
      title: 'NOTIFICATIONS',
      items: [
        { key: 'notifications', label: 'Notifications', icon: Bell },
        { key: 'emailPreferences', label: 'Email Preferences', icon: Mail },
      ],
    },
    {
      title: 'SETTINGS',
      items: [
        { key: 'changePassword', label: 'Change Password', icon: Lock },
        { key: 'privacySecurity', label: 'Privacy & Security', icon: Shield },
        { key: 'language', label: 'Language', icon: Globe },
        { key: 'appearance', label: 'Appearance', icon: Palette },
      ],
    },
    {
      title: 'REWARDS',
      items: [
        { key: 'coupons', label: 'Coupons', icon: Tag },
        { key: 'loyaltyPoints', label: 'Loyalty Points', icon: Award },
      ],
    },
    {
      title: 'SUPPORT',
      items: [
        { key: 'helpCenter', label: 'Help Center', icon: HelpCircle },
        { key: 'contactSupport', label: 'Contact Support', icon: MessageCircle },
        { key: 'faqs', label: 'FAQs', icon: Phone },
      ],
    },
  ];

  const renderSectionTitle = (title) => (
    <div className="px-4 mb-2 mt-4 flex items-center gap-2">
      <span className="w-0.5 h-3 bg-pink-600 rounded-full"></span>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">{title}</h3>
    </div>
  );

  const renderMenuItem = (item) => {
    const Icon = item.icon;
    const isActive = activeModal === item.key;
    const isDanger = item.variant === 'danger';
    const handleItemClick = () => {
      if (item.key === 'logout') {
        handleLogout();
        return;
      }
      openModal(item.key);
    };
    return (
      <button
        key={item.key}
        onClick={handleItemClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
          isDanger
            ? 'text-red-600 hover:bg-red-50 hover:border-red-100 border-transparent'
            : isActive
              ? 'bg-pink-50 text-pink-700 border border-pink-100'
              : 'text-gray-600 hover:bg-gray-50 hover:text-pink-600'
        }`}
      >
        <Icon className="w-5 h-5 shrink-0" />
        <span>{item.label}</span>
      </button>
    );
  };

  // ---------------- Modal contents ----------------

  const renderModalContent = () => {
    switch (activeModal) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="bg-pink-50 rounded-2xl p-6 text-center">
              <div className="w-20 h-20 rounded-full bg-pink-200 flex items-center justify-center mx-auto mb-4 text-3xl font-bold text-pink-700">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{user?.name || 'User'}</h3>
              <p className="text-gray-500 text-sm">{user?.email}</p>
              <p className="mt-2 text-sm text-gray-600">Member since {new Date().getFullYear()}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Total Orders</p>
                <p className="text-lg font-semibold text-gray-900">{orders.length}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Wishlist Items</p>
                <p className="text-lg font-semibold text-gray-900">{displayableWishlistCount}</p>
              </div>
            </div>
            <button
              onClick={() => {
                closeModal();
                setEditProfileForm({ name: user?.name || '', phone: user?.phone || '', address: addresses[0]?.street || '' });
                setIsOpen(true);
                openModal('profile');
              }}
              className="w-full py-3 bg-pink-600 text-white rounded-xl font-medium hover:bg-pink-700 transition flex items-center justify-center gap-2"
            >
              <Edit className="w-4 h-4" /> Edit Profile
            </button>
          </div>
        );

      case 'orders':
        return (
          <div className="space-y-4">
            {ordersLoading ? (
              <p className="text-gray-500 text-center py-8">Loading orders...</p>
            ) : orders.length === 0 ? (
              <p className="text-gray-500 text-center py-8">You have no orders yet.</p>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="border border-pink-100 rounded-xl p-4 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium text-gray-800">
                        Order #{order.id?.toString().slice(-6) || order.id}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">₹{order.amount}</p>
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full ${
                          order.status === 'Delivered'
                            ? 'bg-green-100 text-green-700'
                            : order.status === 'Cancelled'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'wishlist': {
        const wishlistProducts =
          sarees.length === 0
            ? []
            : (wishlist || [])
                .map((s) =>
                  sarees.find(
                    (sa) =>
                      String(sa.id) === String(s._id || s.id || s) ||
                      String(sa._id) === String(s._id || s.id || s)
                  )
                )
                .filter(Boolean);
        return (
          <div className="space-y-4">
            {wishlistProducts.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Your wishlist is empty.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {wishlistProducts.map((p) => (
                  <div key={p.id || p._id} className="flex gap-3 items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <img
                      src={
                        p.image
                          ? p.image.startsWith('http')
                            ? p.image
                            : `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/images/${p.image}`
                          : ''
                      }
                      alt={p.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                      <p className="text-xs text-gray-500">₹{p.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      }

      case 'cart':
        return (
          <div className="space-y-4">
            {displayableCartCount === 0 ? (
              <p className="text-gray-500 text-center py-8">Your cart is empty.</p>
            ) : (
              <div className="space-y-3">
                {Object.keys(cartItem || {}).map((id) => {
                  const product = sarees.find((s) => String(s.id) === id || String(s._id) === id);
                  if (!product) return null;
                  const qty = cartItem[id];
                  return (
                    <div key={id} className="flex gap-3 items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <img
                        src={
                          product.image
                            ? product.image.startsWith('http')
                              ? product.image
                              : `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/images/${product.image}`
                            : ''
                        }
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                        <p className="text-xs text-gray-500">Qty: {qty} × ₹{product.price}</p>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">₹{product.price * qty}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );

      case 'addresses':
        return (
          <div className="space-y-6">
            {loading.addresses ? (
              <p className="text-gray-500 text-center py-8">Loading addresses...</p>
            ) : addresses.length === 0 ? (
              <div className="text-center py-8">
                <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No saved addresses yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`p-4 rounded-xl border flex justify-between items-start ${
                      addr.isDefault ? 'bg-pink-50 border-pink-100' : 'bg-white border-gray-100'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium text-gray-900">{addr.street}, {addr.city}</p>
                        {addr.isDefault && (
                          <span className="px-2 py-0.5 text-xs bg-pink-100 text-pink-700 rounded-full font-medium">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">{addr.state} - {addr.pincode}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveAddress(addr.id)}
                      className="text-pink-600 hover:text-pink-700 text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="pt-4 border-t">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Add New Address</h4>
              <form onSubmit={handleAddAddress} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">Street</label>
                    <input
                      name="street"
                      value={addressForm.street}
                      onChange={handleAddressFormChange}
                      placeholder="Street address"
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">City</label>
                    <input
                      name="city"
                      value={addressForm.city}
                      onChange={handleAddressFormChange}
                      placeholder="City"
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none text-sm"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">State</label>
                    <input
                      name="state"
                      value={addressForm.state}
                      onChange={handleAddressFormChange}
                      placeholder="State"
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">Pincode</label>
                    <input
                      name="pincode"
                      value={addressForm.pincode}
                      onChange={handleAddressFormChange}
                      placeholder="Pincode"
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none text-sm"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={addressForm.isDefault}
                    onChange={(e) =>
                      setAddressForm((prev) => ({ ...prev, isDefault: e.target.checked }))
                    }
                    className="w-4 h-4 text-pink-600 rounded border-gray-300"
                  />
                  <label className="text-xs text-gray-600">Set as default</label>
                </div>
                <button
                  type="submit"
                  disabled={loading.addresses}
                  className="w-full py-2.5 bg-pink-600 text-white rounded-xl font-medium hover:bg-pink-700 transition disabled:opacity-70"
                >
                  {loading.addresses ? 'Adding...' : 'Save Address'}
                </button>
              </form>
            </div>
          </div>
        );

      case 'paymentMethods':
        return (
          <div className="space-y-6">
            {loading.paymentMethods ? (
              <p className="text-gray-500 text-center py-8">Loading payment methods...</p>
            ) : paymentMethods.length === 0 ? (
              <div className="text-center py-8">
                <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No payment methods saved yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {paymentMethods.map((pm) => (
                  <div
                    key={pm.id}
                    className={`p-4 rounded-xl border flex justify-between items-start ${
                      pm.isDefault ? 'bg-pink-50 border-pink-100' : 'bg-white border-gray-100'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium text-gray-900">{pm.cardName}</p>
                        {pm.isDefault && (
                          <span className="px-2 py-0.5 text-xs bg-pink-100 text-pink-700 rounded-full font-medium">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-mono text-gray-500">{pm.cardNumber}</p>
                      <p className="text-xs text-gray-500">Expires: {pm.expiry}</p>
                    </div>
                    <button
                      onClick={() => handleRemovePaymentMethod(pm.id)}
                      className="text-pink-600 hover:text-pink-700 text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="pt-4 border-t">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Add Payment Method</h4>
              <form onSubmit={handleAddPaymentMethod} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600">Card Name</label>
                  <input
                    name="cardName"
                    value={paymentMethodForm.cardName}
                    onChange={handlePaymentMethodFormChange}
                    placeholder="Name on card"
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600">Card Number</label>
                  <input
                    name="cardNumber"
                    value={paymentMethodForm.cardNumber}
                    onChange={handlePaymentMethodFormChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">Expiry (MM/YY)</label>
                    <input
                      name="expiry"
                      value={paymentMethodForm.expiry}
                      onChange={handlePaymentMethodFormChange}
                      placeholder="12/28"
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600">CVV</label>
                    <input
                      name="cvv"
                      value={paymentMethodForm.cvv}
                      onChange={handlePaymentMethodFormChange}
                      placeholder="123"
                      maxLength="4"
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none text-sm"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={paymentMethodForm.isDefault}
                    onChange={(e) =>
                      setPaymentMethodForm((prev) => ({ ...prev, isDefault: e.target.checked }))
                    }
                    className="w-4 h-4 text-pink-600 rounded border-gray-300"
                  />
                  <label className="text-xs text-gray-600">Set as default</label>
                </div>
                <button
                  type="submit"
                  disabled={loading.paymentMethods}
                  className="w-full py-2.5 bg-pink-600 text-white rounded-xl font-medium hover:bg-pink-700 transition disabled:opacity-70"
                >
                  {loading.paymentMethods ? 'Adding...' : 'Save Card'}
                </button>
              </form>
            </div>
          </div>
        );

      case 'transactions':
        return (
          <div className="space-y-6">
            {loading.transactions ? (
              <p className="text-gray-500 text-center py-8">Loading transactions...</p>
            ) : transactions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No transactions yet.</p>
            ) : (
              <div className="space-y-3">
                {transactions.map((t) => (
                  <div key={t.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{t.type}</p>
                      <p className="text-xs text-gray-500">{new Date(t.date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${t.amount.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                        {t.amount}
                      </p>
                      <p className="text-xs text-gray-400">{t.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'refunds':
        return (
          <div className="space-y-6">
            {loading.refunds ? (
              <p className="text-gray-500 text-center py-8">Loading refunds...</p>
            ) : refunds.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No refund requests at the moment.</p>
            ) : (
              <div className="space-y-3">
                {refunds.map((r) => (
                  <div key={r.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Refund - Order #{r.id}</p>
                      <p className="text-xs text-gray-500">{new Date(r.date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">{r.amount}</p>
                      <p className="text-xs text-gray-400">{r.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-4">
            {[
              'Your order has been delivered.',
              'New handloom collection just arrived!',
              'Your wishlist item is back in stock.',
            ].map((n, i) => (
              <div key={i} className="flex gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <Bell className="w-5 h-5 text-pink-500 shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700 leading-relaxed">{n}</p>
              </div>
            ))}
          </div>
        );

      case 'emailPreferences':
        return (
          <div className="space-y-6">
            {[
              { label: 'Order updates', desc: 'Get notified about your order status' },
              { label: 'Promotional emails', desc: 'Offers, discounts & new arrivals' },
              { label: 'Newsletter', desc: 'Weekly handloom stories & tips' },
            ].map((opt, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">{opt.label}</p>
                  <p className="text-xs text-gray-500">{opt.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
                </label>
              </div>
            ))}
          </div>
        );

      case 'changePassword':
        return (
          <div className="space-y-6">
            {loading.password ? (
              <p className="text-gray-500 text-center py-8">Processing...</p>
            ) : (
              <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <input
                    name="currentPassword"
                    type="password"
                    value={changePasswordForm.currentPassword}
                    onChange={handleChangePasswordChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input
                    name="newPassword"
                    type="password"
                    value={changePasswordForm.newPassword}
                    onChange={handleChangePasswordChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                  <input
                    name="confirmPassword"
                    type="password"
                    value={changePasswordForm.confirmPassword}
                    onChange={handleChangePasswordChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
                    placeholder="••••••••"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading.password}
                  className="w-full py-3 bg-pink-600 text-white rounded-xl font-medium hover:bg-pink-700 transition disabled:opacity-70"
                >
                  {loading.password ? 'Changing...' : 'Change Password'}
                </button>
              </form>
            )}
          </div>
        );

      case 'privacySecurity':
        return (
          <div className="space-y-6">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-sm text-gray-500">Two-factor authentication is not enabled.</p>
              <button
                onClick={closeModal}
                className="mt-3 text-xs text-pink-600 font-medium hover:underline"
              >
                Enable 2FA
              </button>
            </div>
            <button
              onClick={closeModal}
              className="w-full py-3 border border-pink-200 text-pink-600 rounded-xl font-medium hover:bg-pink-50 transition"
            >
              View Active Sessions
            </button>
          </div>
        );

      case 'language':
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">Select your preferred language:</p>
            <div className="space-y-2">
              {['English', 'Hindi', 'Tamil', 'Telugu', 'Bengali'].map((lang) => (
                <button
                  key={lang}
                  onClick={closeModal}
                  className={`w-full py-3 px-4 rounded-xl border text-left font-medium transition ${
                    lang === 'English'
                      ? 'bg-pink-50 border-pink-100 text-pink-700'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-pink-200'
                  }`}
                >
                  {lang}
                  {lang === 'English' && <span className="ml-auto text-pink-500">✓</span>}
                </button>
              ))}
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            <p className="text-sm text-gray-500">Choose your theme:</p>
            <div className="grid grid-cols-2 gap-4">
              {['Light', 'Dark'].map((theme) => (
                <button
                  key={theme}
                  onClick={closeModal}
                  className={`p-6 rounded-xl border flex flex-col items-center gap-2 transition ${
                    theme === 'Light'
                      ? 'bg-pink-50 border-pink-100 text-pink-700'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-pink-200'
                  }`}
                >
                  {theme === 'Light' ? <Palette className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                  <span className="text-sm font-medium">{theme}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 'coupons':
        return (
          <div className="space-y-4">
            {[
              { code: 'WELCOME10', desc: '10% off on first order', status: 'Active' },
              { code: 'HANDLOOM20', desc: '₹200 off above ₹1000', status: 'Active' },
            ].map((c, i) => (
              <div key={i} className="p-3 bg-green-50 rounded-xl border border-green-100">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-mono font-bold text-green-700 text-sm">{c.code}</span>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">{c.status}</span>
                </div>
                <p className="text-xs text-green-600">{c.desc}</p>
              </div>
            ))}
          </div>
        );

      case 'loyaltyPoints':
        return (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto text-2xl font-bold text-amber-700">
              ★
            </div>
            <h4 className="text-lg font-semibold text-gray-900">1,250 Points</h4>
            <p className="text-sm text-gray-500">Silver Tier • Earn ₹5 off per 100 points</p>
          </div>
        );

      case 'helpCenter':
        return (
          <div className="space-y-4">
            {[
              'How to place an order?',
              'How to track my shipment?',
              'Return & refund policy',
              'Payment options',
            ].map((q, i) => (
              <button
                key={i}
                onClick={closeModal}
                className="w-full py-3 px-4 text-left bg-gray-50 rounded-xl border border-gray-100 font-medium text-gray-700 hover:bg-pink-50 hover:text-pink-700 transition flex justify-between items-center"
              >
                <span>{q}</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            ))}
          </div>
        );

      case 'contactSupport':
        return (
          <div className="space-y-4">
            <form onClick={(e) => e.stopPropagation()} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none" placeholder="What do you need help with?" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none" placeholder="Describe your issue..." />
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="w-full py-3 bg-pink-600 text-white rounded-xl font-medium hover:bg-pink-700 transition"
              >
                Send Message
              </button>
            </form>
          </div>
        );

      case 'faqs':
        return (
          <div className="space-y-3">
            {[
              { q: 'How do I track my order?', a: 'Go to My Orders and click on your order to see tracking details.' },
              { q: 'What is your return policy?', a: 'Returns accepted within 7 days of delivery if unused.' },
              { q: 'Do you offer cash on delivery?', a: 'Yes, COD is available for most pincodes.' },
            ].map((faq, i) => (
              <div key={i} className="border border-gray-100 rounded-xl p-4 bg-gray-50">
                <p className="text-sm font-medium text-gray-800 mb-2">Q. {faq.q}</p>
                <p className="text-sm text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  // ---------------- Edit Profile Modal Content ----------------

  const renderEditProfileContent = () => (
    <div className="space-y-6">
      <div className="bg-pink-50 rounded-2xl p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-pink-200 flex items-center justify-center mx-auto mb-4 text-3xl font-bold text-pink-700">
          {user?.name?.charAt(0) || 'U'}
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Edit Profile</h3>
        <p className="text-gray-500 text-sm">Update your personal information</p>
      </div>
      <form onSubmit={handleEditProfileSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            name="name"
            value={editProfileForm.name}
            onChange={handleEditProfileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
            placeholder="Enter your name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input
            name="phone"
            type="tel"
            value={editProfileForm.phone}
            onChange={handleEditProfileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
            placeholder="Enter your phone number"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <textarea
            name="address"
            value={editProfileForm.address}
            onChange={handleEditProfileChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
            placeholder="Enter your address"
          />
        </div>
        <button
          type="submit"
          disabled={loading.profile}
          className="w-full py-3 bg-pink-600 text-white rounded-xl font-medium hover:bg-pink-700 transition disabled:opacity-70"
        >
          {loading.profile ? 'Updating...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );

  const userName = user?.name || 'User';
  const userEmail = user?.email;

  return (
    <>
      {/* Toast notification */}
      {toast && (
        <div className={`fixed bottom-4 right-4 z-50 p-4 rounded-xl shadow-lg flex items-center gap-3 ${
          toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {toast.type === 'success' ? (
            <UserCircle className="w-5 h-5" />
          ) : (
            <X className="w-5 h-5" />
          )}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* Sidebar overlay */}
      {propIsOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm"
          onClick={() => propSetIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-[60] w-full md:w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
          propIsOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="navigation"
        aria-label="User account sidebar"
      >
        {/* Sidebar header */}
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <UserCircle className="w-6 h-6 text-pink-600" />
            My Account
          </h2>
          <button onClick={() => propSetIsOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100" aria-label="Close sidebar">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile section */}
        <div className="p-6 border-b">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-semibold text-lg">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-gray-900 truncate">{userName}</p>
              <p className="text-sm text-gray-500 truncate">{userEmail}</p>
            </div>
          </div>
          <button
            onClick={() => {
              closeModal();
              setEditProfileForm({ name: user?.name || '', phone: user?.phone || '', address: addresses[0]?.street || '' });
              openModal('profile');
            }}
            className="w-full py-2.5 text-sm text-pink-600 font-medium flex items-center justify-center gap-1.5 hover:bg-pink-50 rounded-lg transition"
          >
            <Edit className="w-4 h-4" /> Edit Profile
          </button>
        </div>

        {/* Menu sections */}
        <nav className="p-2 space-y-1 overflow-y-auto max-h-[calc(100vh-200px)] pr-2">
          {menuSections.map((section) => (
            <React.Fragment key={section.title}>
              {renderSectionTitle(section.title)}
              <div className="space-y-1">
                {section.items.map((item) => renderMenuItem(item))}
              </div>
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={activeModal ? modalTitles[activeModal] : ''}
        size="lg"
      >
        {activeModal === 'profile' ? renderEditProfileContent() : renderModalContent()}
      </Modal>
    </>
  );
};

export default UserSidebar;
