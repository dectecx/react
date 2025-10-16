export type Language = 'zh-TW' | 'en-US';

export interface Translations {
  // Header
  appTitle: string;
  admin: string;
  user: string;
  logout: string;
  
  // Login Page
  login: string;
  register: string;
  username: string;
  password: string;
  loginButton: string;
  registerButton: string;
  needAccount: string;
  alreadyHaveAccount: string;
  usernameRequired: string;
  passwordRequired: string;
  loginSuccess: string;
  registerSuccess: string;
  loginError: string;
  registerError: string;
  
  // Work Items List
  workItemsList: string;
  addNewWorkItem: string;
  noWorkItems: string;
  noWorkItemsMessage: string;
  noWorkItemsAdminMessage: string;
  id: string;
  title: string;
  status: string;
  actions: string;
  view: string;
  edit: string;
  delete: string;
  undo: string;
  confirmSelectedItems: string;
  selectAll: string;
  pending: string;
  confirmed: string;
  
  // Work Item Edit
  createWorkItem: string;
  editWorkItem: string;
  description: string;
  titleRequired: string;
  create: string;
  update: string;
  cancel: string;
  createSuccess: string;
  updateSuccess: string;
  createError: string;
  updateError: string;
  
  // Confirmations
  confirmDelete: string;
  confirmUndo: string;
  deleteSuccess: string;
  deleteError: string;
  undoSuccess: string;
  undoError: string;
  confirmSuccess: string;
  confirmError: string;
  
  // Loading Messages
  loading: string;
  loggingIn: string;
  registering: string;
  loadingWorkItems: string;
  creatingWorkItem: string;
  updatingWorkItem: string;
  deletingWorkItem: string;
  confirmingItems: string;
  undoingConfirmation: string;
  
  // Test Button
  testLoading: string;
  showTestButton: string;
  hideTestButton: string;
  
  // Test Data
  createTestData: string;
  testDataInfo: string;
  testDataAdminInfo: string;
  testDataUserInfo: string;
  creatingTestData: string;
  testDataCreated: string;
  testDataError: string;
}

const translations: Record<Language, Translations> = {
  'zh-TW': {
    // Header
    appTitle: '工作項目管理',
    admin: '管理員',
    user: '使用者',
    logout: '登出',
    
    // Login Page
    login: '登入',
    register: '註冊',
    username: '使用者名稱',
    password: '密碼',
    loginButton: '登入',
    registerButton: '註冊',
    needAccount: '需要帳號？註冊',
    alreadyHaveAccount: '已有帳號？登入',
    usernameRequired: '使用者名稱和密碼為必填項目。',
    passwordRequired: '使用者名稱和密碼為必填項目。',
    loginSuccess: '登入成功！',
    registerSuccess: '註冊成功！請登入。',
    loginError: '登入失敗。',
    registerError: '註冊失敗。',
    
    // Work Items List
    workItemsList: '工作項目列表',
    addNewWorkItem: '新增工作項目',
    noWorkItems: '尚無工作項目！',
    noWorkItemsMessage: '尚無工作項目可用。',
    noWorkItemsAdminMessage: '使用上方表單新增第一個工作項目。',
    id: '編號',
    title: '標題',
    status: '狀態',
    actions: '操作',
    view: '查看',
    edit: '編輯',
    delete: '刪除',
    undo: '撤銷',
    confirmSelectedItems: '確認選取項目',
    selectAll: '全選',
    pending: '待確認',
    confirmed: '已確認',
    
    // Work Item Edit
    createWorkItem: '建立新工作項目',
    editWorkItem: '編輯工作項目',
    description: '描述',
    titleRequired: '標題為必填項目。',
    create: '建立',
    update: '更新',
    cancel: '取消',
    createSuccess: '工作項目建立成功！',
    updateSuccess: '工作項目更新成功！',
    createError: '建立工作項目失敗。',
    updateError: '更新工作項目失敗。',
    
    // Confirmations
    confirmDelete: '確定要刪除此項目嗎？',
    confirmUndo: '確定要將此項目標記回「待確認」嗎？',
    deleteSuccess: '成功刪除工作項目！',
    deleteError: '刪除工作項目失敗。',
    undoSuccess: '已將項目標記為待確認',
    undoError: '撤銷確認失敗，請重試',
    confirmSuccess: '成功確認 {count} 個項目。',
    confirmError: '確認項目失敗，請重試',
    
    // Loading Messages
    loading: '載入中...',
    loggingIn: '登入中...',
    registering: '註冊中...',
    loadingWorkItems: '載入工作項目...',
    creatingWorkItem: '建立工作項目...',
    updatingWorkItem: '更新工作項目...',
    deletingWorkItem: '刪除工作項目...',
    confirmingItems: '確認項目...',
    undoingConfirmation: '撤銷確認...',
    
    // Test Button
    testLoading: '測試 Loading 動畫(請欣賞~)',
    showTestButton: '顯示測試按鈕',
    hideTestButton: '隱藏測試按鈕',
    
    // Test Data
    createTestData: '建立測試資料',
    testDataInfo: '測試帳號資訊',
    testDataAdminInfo: '管理員帳號：admin / 密碼：123456',
    testDataUserInfo: '一般使用者帳號：user / 密碼：123456',
    creatingTestData: '建立測試資料中...',
    testDataCreated: '測試資料建立成功！',
    testDataError: '建立測試資料失敗。',
  },
  'en-US': {
    // Header
    appTitle: 'Work Items Management',
    admin: 'Admin',
    user: 'User',
    logout: 'Logout',
    
    // Login Page
    login: 'Login',
    register: 'Register',
    username: 'Username',
    password: 'Password',
    loginButton: 'Login',
    registerButton: 'Register',
    needAccount: 'Need an account? Register',
    alreadyHaveAccount: 'Already have an account? Login',
    usernameRequired: 'Username and password are required.',
    passwordRequired: 'Username and password are required.',
    loginSuccess: 'Login successful!',
    registerSuccess: 'Registration successful! Please log in.',
    loginError: 'Login failed.',
    registerError: 'Registration failed.',
    
    // Work Items List
    workItemsList: 'Work Items List',
    addNewWorkItem: 'Add New Work Item',
    noWorkItems: 'No work items yet!',
    noWorkItemsMessage: 'No work items available.',
    noWorkItemsAdminMessage: 'Use the form above to add your first work item.',
    id: 'ID',
    title: 'Title',
    status: 'Status',
    actions: 'Actions',
    view: 'View',
    edit: 'Edit',
    delete: 'Delete',
    undo: 'Undo',
    confirmSelectedItems: 'Confirm Selected Items',
    selectAll: 'Select All',
    pending: 'Pending',
    confirmed: 'Confirmed',
    
    // Work Item Edit
    createWorkItem: 'Create New Work Item',
    editWorkItem: 'Edit Work Item',
    description: 'Description',
    titleRequired: 'Title is required.',
    create: 'Create',
    update: 'Update',
    cancel: 'Cancel',
    createSuccess: 'Work item created successfully!',
    updateSuccess: 'Work item updated successfully!',
    createError: 'Failed to create work item.',
    updateError: 'Failed to update work item.',
    
    // Confirmations
    confirmDelete: 'Are you sure you want to delete this item?',
    confirmUndo: 'Are you sure you want to mark this item as pending?',
    deleteSuccess: 'Successfully deleted work item!',
    deleteError: 'Failed to delete work item.',
    undoSuccess: 'Item marked as pending',
    undoError: 'Failed to undo confirmation, please try again',
    confirmSuccess: 'Successfully confirmed {count} item(s).',
    confirmError: 'Failed to confirm items. Please try again.',
    
    // Loading Messages
    loading: 'Loading...',
    loggingIn: 'Logging in...',
    registering: 'Registering...',
    loadingWorkItems: 'Loading work items...',
    creatingWorkItem: 'Creating work item...',
    updatingWorkItem: 'Updating work item...',
    deletingWorkItem: 'Deleting work item...',
    confirmingItems: 'Confirming items...',
    undoingConfirmation: 'Undoing confirmation...',
    
    // Test Button
    testLoading: 'Test Loading',
    showTestButton: 'Show Test Button',
    hideTestButton: 'Hide Test Button',
    
    // Test Data
    createTestData: 'Create Test Data',
    testDataInfo: 'Test Account Information',
    testDataAdminInfo: 'Admin Account: admin / Password: 123456',
    testDataUserInfo: 'User Account: user / Password: 123456',
    creatingTestData: 'Creating test data...',
    testDataCreated: 'Test data created successfully!',
    testDataError: 'Failed to create test data.',
  },
};

class I18nManager {
  private static instance: I18nManager;
  private currentLanguage: Language = 'zh-TW';
  private subscribers: Array<(language: Language) => void> = [];

  private constructor() {
    // Load language from localStorage
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && translations[savedLanguage]) {
      this.currentLanguage = savedLanguage;
    }
  }

  public static getInstance(): I18nManager {
    if (!I18nManager.instance) {
      I18nManager.instance = new I18nManager();
    }
    return I18nManager.instance;
  }

  public getCurrentLanguage(): Language {
    return this.currentLanguage;
  }

  public setLanguage(language: Language): void {
    this.currentLanguage = language;
    localStorage.setItem('language', language);
    this.notifySubscribers();
  }

  public t(key: keyof Translations, params?: Record<string, string | number>): string {
    let translation = translations[this.currentLanguage][key];
    
    // Replace parameters in translation
    if (params) {
      Object.entries(params).forEach(([paramKey, value]) => {
        translation = translation.replace(`{${paramKey}}`, String(value));
      });
    }
    
    return translation;
  }

  public subscribe(callback: (language: Language) => void): () => void {
    this.subscribers.push(callback);
    // Immediately call with current language
    callback(this.currentLanguage);
    
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  private notifySubscribers(): void {
    this.subscribers.forEach(callback => callback(this.currentLanguage));
  }
}

export const i18n = I18nManager.getInstance();
