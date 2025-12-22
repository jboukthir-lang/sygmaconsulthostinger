// Translations for the entire application
// Primary language: French (fr)
// Secondary languages: Arabic (ar), English (en)

export type Language = 'fr' | 'ar' | 'en';

export const translations = {
  // Common translations
  common: {
    welcome: {
      fr: 'Bienvenue',
      ar: 'مرحباً',
    },
    loading: {
      fr: 'Chargement...',
      ar: 'جاري التحميل...',
    },
    save: {
      fr: 'Enregistrer',
      ar: 'حفظ',
      en: 'Save',
    },
    saving: {
      fr: 'Enregistrement...',
      ar: 'جاري الحفظ...',
      en: 'Saving...',
    },
    cancel: {
      fr: 'Annuler',
      ar: 'إلغاء',
      en: 'Cancel',
    },
    delete: {
      fr: 'Supprimer',
      ar: 'حذف',
      en: 'Delete',
    },
    edit: {
      fr: 'Modifier',
      ar: 'تعديل',
      en: 'Edit',
    },
    view: {
      fr: 'Voir',
      ar: 'عرض',
      en: 'View',
    },
    upload: {
      fr: 'Télécharger',
      ar: 'تحميل',
      en: 'Upload',
    },
    download: {
      fr: 'Télécharger le fichier',
      ar: 'تنزيل الملف',
      en: 'Download',
    },
    signIn: {
      fr: 'Se connecter',
      ar: 'تسجيل الدخول',
      en: 'Sign In',
    },
    signOut: {
      fr: 'Se déconnecter',
      ar: 'تسجيل الخروج',
      en: 'Sign Out',
    },
    search: {
      fr: 'Rechercher',
      ar: 'بحث',
    },
    filter: {
      fr: 'Filtrer',
      ar: 'تصفية',
    },
    all: {
      fr: 'Tous',
      ar: 'الكل',
    },
    close: {
      fr: 'Fermer',
      ar: 'إغلاق',
    },
    confirm: {
      fr: 'Confirmer',
      ar: 'تأكيد',
    },
    back: {
      fr: 'Retour',
      ar: 'رجوع',
    },
    next: {
      fr: 'Suivant',
      ar: 'التالي',
    },
    submit: {
      fr: 'Soumettre',
      ar: 'إرسال',
    },
    send: {
      fr: 'Envoyer',
      ar: 'إرسال',
    },
    success: {
      fr: 'Succès',
      ar: 'نجاح',
    },
    error: {
      fr: 'Erreur',
      ar: 'خطأ',
    },
    warning: {
      fr: 'Attention',
      ar: 'تحذير',
    },
    info: {
      fr: 'Information',
      ar: 'معلومات',
    },
  },

  // Authentication
  auth: {
    signIn: {
      fr: 'Se connecter',
      ar: 'تسجيل الدخول',
    },
    signUp: {
      fr: 'S\'inscrire',
      ar: 'إنشاء حساب',
    },
    signOut: {
      fr: 'Se déconnecter',
      ar: 'تسجيل الخروج',
    },
    logout: {
      fr: 'Déconnexion',
      ar: 'خروج',
    },
    email: {
      fr: 'Email',
      ar: 'البريد الإلكتروني',
    },
    password: {
      fr: 'Mot de passe',
      ar: 'كلمة المرور',
    },
    confirmPassword: {
      fr: 'Confirmer le mot de passe',
      ar: 'تأكيد كلمة المرور',
    },
    forgotPassword: {
      fr: 'Mot de passe oublié?',
      ar: 'نسيت كلمة المرور؟',
    },
    resetPassword: {
      fr: 'Réinitialiser le mot de passe',
      ar: 'إعادة تعيين كلمة المرور',
    },
    fullName: {
      fr: 'Nom complet',
      ar: 'الاسم الكامل',
    },
    createAccount: {
      fr: 'Créer un compte',
      ar: 'إنشاء حساب',
    },
    alreadyHaveAccount: {
      fr: 'Vous avez déjà un compte?',
      ar: 'لديك حساب بالفعل؟',
    },
    dontHaveAccount: {
      fr: 'Vous n\'avez pas de compte?',
      ar: 'ليس لديك حساب؟',
    },
    continueWithGoogle: {
      fr: 'Continuer avec Google',
      ar: 'المتابعة مع Google',
    },
    orSignInWith: {
      fr: 'Ou se connecter avec',
      ar: 'أو سجل الدخول بـ',
    },
  },

  // Navigation
  nav: {
    home: {
      fr: 'Accueil',
      ar: 'الرئيسية',
    },
    about: {
      fr: 'À propos',
      ar: 'من نحن',
    },
    services: {
      fr: 'Services',
      ar: 'الخدمات',
    },
    contact: {
      fr: 'Contact',
      ar: 'اتصل بنا',
    },
    profile: {
      fr: 'Profil',
      ar: 'الملف الشخصي',
    },
    dashboard: {
      fr: 'Tableau de bord',
      ar: 'لوحة التحكم',
    },
    admin: {
      fr: 'Administration',
      ar: 'الإدارة',
    },
  },

  // Profile sections
  profile: {
    myProfile: {
      fr: 'Mon profil',
      ar: 'ملفي الشخصي',
    },
    myBookings: {
      fr: 'Mes réservations',
      ar: 'حجوزاتي',
    },
    myDocuments: {
      fr: 'Mes documents',
      ar: 'مستنداتي',
    },
    notifications: {
      fr: 'Notifications',
      ar: 'الإشعارات',
    },
    settings: {
      fr: 'Paramètres',
      ar: 'الإعدادات',
    },
    personalInfo: {
      fr: 'Informations personnelles',
      ar: 'المعلومات الشخصية',
    },
    accountSettings: {
      fr: 'Paramètres du compte',
      ar: 'إعدادات الحساب',
    },
    security: {
      fr: 'Sécurité',
      ar: 'الأمان',
    },
    preferences: {
      fr: 'Préférences',
      ar: 'التفضيلات',
    },
    language: {
      fr: 'Langue',
      ar: 'اللغة',
    },
    changePassword: {
      fr: 'Changer le mot de passe',
      ar: 'تغيير كلمة المرور',
    },
    currentPassword: {
      fr: 'Mot de passe actuel',
      ar: 'كلمة المرور الحالية',
    },
    newPassword: {
      fr: 'Nouveau mot de passe',
      ar: 'كلمة المرور الجديدة',
    },
    manageInfo: {
      fr: 'Gérer vos informations personnelles',
      ar: 'إدارة معلوماتك الشخصية',
      en: 'Manage your personal information',
    },
    editProfile: {
      fr: 'Modifier le profil',
      ar: 'تعديل الملف الشخصي',
      en: 'Edit Profile',
    },
    userName: {
      fr: 'Nom d\'utilisateur',
      ar: 'اسم المستخدم',
      en: 'User Name',
    },
    phone: {
      fr: 'Téléphone',
      ar: 'الهاتف',
      en: 'Phone',
    },
    company: {
      fr: 'Entreprise',
      ar: 'الشركة',
      en: 'Company',
    },
    country: {
      fr: 'Pays',
      ar: 'البلد',
      en: 'Country',
    },
    city: {
      fr: 'Ville',
      ar: 'المدينة',
      en: 'City',
    },
    address: {
      fr: 'Adresse',
      ar: 'العنوان',
      en: 'Address',
    },
    preferredLanguage: {
      fr: 'Langue préférée',
      ar: 'اللغة المفضلة',
      en: 'Preferred Language',
    },
    enterName: {
      fr: 'Entrez votre nom complet',
      ar: 'أدخل اسمك الكامل',
      en: 'Enter your full name',
    },
    enterEmail: {
      fr: 'Entrez votre email',
      ar: 'أدخل بريدك الإلكتروني',
      en: 'Enter your email',
    },
    enterPhone: {
      fr: 'Entrez votre numéro de téléphone',
      ar: 'أدخل رقم هاتفك',
      en: 'Enter your phone number',
    },
    enterCompany: {
      fr: 'Entrez le nom de votre entreprise',
      ar: 'أدخل اسم شركتك',
      en: 'Enter your company name',
    },
    enterCity: {
      fr: 'Entrez votre ville',
      ar: 'أدخل مدينتك',
      en: 'Enter your city',
    },
    enterAddress: {
      fr: 'Entrez votre adresse',
      ar: 'أدخل عنوانك',
      en: 'Enter your address',
    },
    selectCountry: {
      fr: 'Sélectionnez un pays',
      ar: 'اختر بلداً',
      en: 'Select country',
    },
    other: {
      fr: 'Autre',
      ar: 'أخرى',
      en: 'Other',
    },
    totalBookings: {
      fr: 'Total des réservations',
      ar: 'إجمالي الحجوزات',
      en: 'Total Bookings',
    },
    accountStatus: {
      fr: 'Statut du compte',
      ar: 'حالة الحساب',
      en: 'Account Status',
    },
    active: {
      fr: 'Actif',
      ar: 'نشط',
      en: 'Active',
    },
    memberSince: {
      fr: 'Membre depuis',
      ar: 'عضو منذ',
      en: 'Member Since',
    },
    invalidImageType: {
      fr: 'Type de fichier invalide. Veuillez télécharger une image.',
      ar: 'نوع ملف غير صالح. يرجى تحميل صورة.',
      en: 'Invalid file type. Please upload an image.',
    },
    imageTooLarge: {
      fr: 'L\'image est trop grande. Taille maximale: 2MB.',
      ar: 'الصورة كبيرة جداً. الحد الأقصى: 2 ميجابايت.',
      en: 'Image too large. Maximum size: 2MB.',
    },
    photoUpdated: {
      fr: 'Photo de profil mise à jour avec succès',
      ar: 'تم تحديث صورة الملف الشخصي بنجاح',
      en: 'Profile photo updated successfully',
    },
    photoUploadError: {
      fr: 'Erreur lors du téléchargement de la photo',
      ar: 'خطأ في تحميل الصورة',
      en: 'Error uploading photo',
    },
    profileUpdated: {
      fr: 'Profil mis à jour avec succès',
      ar: 'تم تحديث الملف الشخصي بنجاح',
      en: 'Profile updated successfully',
    },
    saveError: {
      fr: 'Erreur lors de l\'enregistrement du profil',
      ar: 'خطأ في حفظ الملف الشخصي',
      en: 'Error saving profile',
    },
  },

  // Admin sections
  admin: {
    dashboard: {
      fr: 'Tableau de bord',
      ar: 'لوحة التحكم',
    },
    consultations: {
      fr: 'Consultations',
      ar: 'الاستشارات',
    },
    bookings: {
      fr: 'Réservations',
      ar: 'الحجوزات',
    },
    messages: {
      fr: 'Messages',
      ar: 'الرسائل',
    },
    contacts: {
      fr: 'Contacts',
      ar: 'جهات الاتصال',
    },
    users: {
      fr: 'Utilisateurs',
      ar: 'المستخدمون',
    },
    analytics: {
      fr: 'Analytique',
      ar: 'التحليلات',
    },
    documents: {
      fr: 'Documents',
      ar: 'المستندات',
    },
    reports: {
      fr: 'Rapports',
      ar: 'التقارير',
    },
    totalBookings: {
      fr: 'Total des réservations',
      ar: 'إجمالي الحجوزات',
    },
    newMessages: {
      fr: 'Nouveaux messages',
      ar: 'رسائل جديدة',
    },
    registeredUsers: {
      fr: 'Utilisateurs enregistrés',
      ar: 'المستخدمون المسجلون',
    },
    conversionRate: {
      fr: 'Taux de conversion',
      ar: 'معدل التحويل',
    },
    recentBookings: {
      fr: 'Réservations récentes',
      ar: 'الحجوزات الأخيرة',
    },
    quickActions: {
      fr: 'Actions rapides',
      ar: 'إجراءات سريعة',
    },
    monthlyOverview: {
      fr: 'Aperçu mensuel',
      ar: 'نظرة شهرية',
    },
    userManagement: {
      fr: 'Gestion des utilisateurs',
      ar: 'إدارة المستخدمين',
    },
    manageUsersAndPrivileges: {
      fr: 'Gérer les utilisateurs et les privilèges administratifs',
      ar: 'إدارة المستخدمين وصلاحيات المشرفين',
    },
    totalUsers: {
      fr: 'Total des utilisateurs',
      ar: 'إجمالي المستخدمين',
    },
    adminUsers: {
      fr: 'Utilisateurs administrateurs',
      ar: 'المستخدمون المشرفون',
    },
    superAdmins: {
      fr: 'Super administrateurs',
      ar: 'المدراء الأعلى',
    },
    newThisMonth: {
      fr: 'Nouveaux ce mois',
      ar: 'جديد هذا الشهر',
    },
    fromLastMonth: {
      fr: 'par rapport au mois dernier',
      ar: 'من الشهر الماضي',
    },
    allUsers: {
      fr: 'Tous les utilisateurs',
      ar: 'جميع المستخدمين',
    },
    searchByName: {
      fr: 'Rechercher par nom, email ou entreprise...',
      ar: 'بحث بالاسم أو البريد أو الشركة...',
    },
    contact: {
      fr: 'Contact',
      ar: 'جهة الاتصال',
    },
    company: {
      fr: 'Entreprise',
      ar: 'الشركة',
    },
    country: {
      fr: 'Pays',
      ar: 'البلد',
    },
    joined: {
      fr: 'Inscrit',
      ar: 'انضم',
    },
    noUsersFound: {
      fr: 'Aucun utilisateur trouvé',
      ar: 'لم يتم العثور على مستخدمين',
    },
    noAdminUsersFound: {
      fr: 'Aucun utilisateur administrateur trouvé',
      ar: 'لم يتم العثور على مستخدمين مشرفين',
    },
    removeAdminPrivileges: {
      fr: 'Êtes-vous sûr de vouloir retirer les privilèges administratifs de cet utilisateur?',
      ar: 'هل أنت متأكد من إزالة صلاحيات الإشراف من هذا المستخدم؟',
    },
    adminPrivilegesRemoved: {
      fr: 'Privilèges administratifs retirés avec succès!',
      ar: 'تم إزالة صلاحيات الإشراف بنجاح!',
    },
    failedToRemoveAdmin: {
      fr: 'Échec de la suppression de l\'utilisateur administrateur',
      ar: 'فشل في إزالة المستخدم المشرف',
    },
    adminUserAdded: {
      fr: 'Utilisateur administrateur ajouté avec succès!',
      ar: 'تم إضافة المستخدم المشرف بنجاح!',
    },
    failedToAddAdmin: {
      fr: 'Échec de l\'ajout de l\'utilisateur administrateur',
      ar: 'فشل في إضافة المستخدم المشرف',
    },
    bookingsManagement: {
      fr: 'Gestion des réservations',
      ar: 'إدارة الحجوزات',
    },
    viewAndManageBookings: {
      fr: 'Voir et gérer toutes les réservations de consultation',
      ar: 'عرض وإدارة جميع حجوزات الاستشارات',
    },
    bookingDetails: {
      fr: 'Détails de la réservation',
      ar: 'تفاصيل الحجز',
    },
    name: {
      fr: 'Nom',
      ar: 'الاسم',
    },
    email: {
      fr: 'Email',
      ar: 'البريد الإلكتروني',
    },
    time: {
      fr: 'Heure',
      ar: 'الوقت',
    },
    cancelBooking: {
      fr: 'Annuler la réservation',
      ar: 'إلغاء الحجز',
    },
    loadingBookings: {
      fr: 'Chargement des réservations...',
      ar: 'جاري تحميل الحجوزات...',
      en: 'Loading bookings...',
    },
    loadingProfile: {
      fr: 'Chargement du profil...',
      ar: 'جاري تحميل الملف الشخصي...',
      en: 'Loading profile...',
    },
    loadingUsers: {
      fr: 'Chargement des utilisateurs...',
      ar: 'جاري تحميل المستخدمين...',
      en: 'Loading users...',
    },
    loadingMessages: {
      fr: 'Chargement des messages...',
      ar: 'جاري تحميل الرسائل...',
    },
    manageContactSubmissions: {
      fr: 'Gérer les soumissions de formulaire de contact',
      ar: 'إدارة رسائل نموذج الاتصال',
    },
    new: {
      fr: 'Nouveau',
      ar: 'جديد',
    },
    messageDetails: {
      fr: 'Détails du message',
      ar: 'تفاصيل الرسالة',
    },
    received: {
      fr: 'Reçu',
      ar: 'استلم',
    },
    replyViaEmail: {
      fr: 'Répondre par email',
      ar: 'الرد عبر البريد',
    },
    markAsRead: {
      fr: 'Marquer comme lu',
      ar: 'تعليم كمقروء',
    },
    searchMessages: {
      fr: 'Rechercher des messages...',
      ar: 'بحث في الرسائل...',
    },
    sendNotificationTitle: {
      fr: 'Envoyer une notification',
      ar: 'إرسال إشعار',
    },
    sendNotificationsToUsers: {
      fr: 'Envoyer des notifications aux utilisateurs sélectionnés',
      ar: 'إرسال إشعارات للمستخدمين المحددين',
    },
    notificationDetails: {
      fr: 'Détails de la notification',
      ar: 'تفاصيل الإشعار',
    },
    notificationType: {
      fr: 'Type de notification',
      ar: 'نوع الإشعار',
    },
    required: {
      fr: 'requis',
      ar: 'مطلوب',
    },
    titlePlaceholder: {
      fr: 'Ex: Nouvelle mise à jour disponible',
      ar: 'مثال: تحديث جديد متاح',
    },
    messagePlaceholder: {
      fr: 'Écrivez votre message ici...',
      ar: 'اكتب رسالتك هنا...',
    },
    linkOptional: {
      fr: 'Lien (optionnel)',
      ar: 'رابط (اختياري)',
    },
    linkPlaceholder: {
      fr: '/profile/bookings',
      ar: '/profile/bookings',
    },
    linkDescription: {
      fr: 'Lien vers lequel l\'utilisateur sera redirigé en cliquant sur la notification',
      ar: 'الرابط الذي سيتم توجيه المستخدم إليه عند النقر على الإشعار',
    },
    sending: {
      fr: 'Envoi en cours...',
      ar: 'جاري الإرسال...',
    },
    recipients: {
      fr: 'Destinataires',
      ar: 'المستلمون',
    },
    sendToAll: {
      fr: 'Envoyer à tous',
      ar: 'إرسال للجميع',
    },
    selectAll: {
      fr: 'Tout sélectionner',
      ar: 'تحديد الكل',
    },
    deselectAll: {
      fr: 'Tout désélectionner',
      ar: 'إلغاء تحديد الكل',
    },
    noUserFound: {
      fr: 'Aucun utilisateur trouvé',
      ar: 'لم يتم العثور على مستخدمين',
    },
    notificationSentSuccess: {
      fr: 'Notification envoyée avec succès!',
      ar: 'تم إرسال الإشعار بنجاح!',
    },
    sentTo: {
      fr: 'Envoyée à',
      ar: 'أرسلت إلى',
    },
    usersCount: {
      fr: 'utilisateurs',
      ar: 'مستخدمين',
    },
    selectAtLeastOneUser: {
      fr: 'Veuillez sélectionner au moins un utilisateur',
      ar: 'يرجى تحديد مستخدم واحد على الأقل',
    },
    fillAllRequired: {
      fr: 'Veuillez remplir tous les champs obligatoires',
      ar: 'يرجى ملء جميع الحقول المطلوبة',
    },
    errorSendingNotification: {
      fr: 'Erreur lors de l\'envoi des notifications',
      ar: 'خطأ في إرسال الإشعارات',
    },
    analyticsTitle: {
      fr: 'Analytique',
      ar: 'التحليلات',
    },
    performanceMetrics: {
      fr: 'Métriques de performance et insights',
      ar: 'مقاييس الأداء والرؤى',
    },
    timeRange: {
      fr: 'Période',
      ar: 'الفترة الزمنية',
    },
    last7Days: {
      fr: '7 derniers jours',
      ar: 'آخر 7 أيام',
    },
    last30Days: {
      fr: '30 derniers jours',
      ar: 'آخر 30 يوم',
    },
    last90Days: {
      fr: '90 derniers jours',
      ar: 'آخر 90 يوم',
    },
    allTime: {
      fr: 'Tout le temps',
      ar: 'كل الوقت',
    },
    userGrowth: {
      fr: 'Croissance des utilisateurs',
      ar: 'نمو المستخدمين',
    },
    responseRate: {
      fr: 'Taux de réponse',
      ar: 'معدل الاستجابة',
    },
    avgResponseTime: {
      fr: 'Temps de réponse moyen',
      ar: 'متوسط وقت الاستجابة',
    },
    hours: {
      fr: 'heures',
      ar: 'ساعات',
    },
    documentsTitle: {
      fr: 'Documents',
      ar: 'المستندات',
    },
    manageDocuments: {
      fr: 'Gérer tous les documents téléchargés',
      ar: 'إدارة جميع المستندات المحملة',
    },
    uploadedBy: {
      fr: 'Téléchargé par',
      ar: 'تم الرفع بواسطة',
    },
    fileType: {
      fr: 'Type de fichier',
      ar: 'نوع الملف',
    },
    fileSize: {
      fr: 'Taille du fichier',
      ar: 'حجم الملف',
    },
    uploadDate: {
      fr: 'Date de téléchargement',
      ar: 'تاريخ الرفع',
    },
    download: {
      fr: 'Télécharger',
      ar: 'تحميل',
    },
    preview: {
      fr: 'Aperçu',
      ar: 'معاينة',
    },
    deleteDocument: {
      fr: 'Êtes-vous sûr de vouloir supprimer ce document?',
      ar: 'هل أنت متأكد من حذف هذا المستند؟',
    },
    documentDeleted: {
      fr: 'Document supprimé avec succès',
      ar: 'تم حذف المستند بنجاح',
    },
    failedToDelete: {
      fr: 'Échec de la suppression du document',
      ar: 'فشل في حذف المستند',
    },
    noDocumentsFound: {
      fr: 'Aucun document trouvé',
      ar: 'لم يتم العثور على مستندات',
    },
    allDocuments: {
      fr: 'Tous les documents',
      ar: 'جميع المستندات',
    },
    pdfs: {
      fr: 'PDFs',
      ar: 'ملفات PDF',
    },
    images: {
      fr: 'Images',
      ar: 'الصور',
    },
    loadingDocuments: {
      fr: 'Chargement des documents...',
      ar: 'جاري تحميل المستندات...',
    },
  },

  // Consultations
  consultations: {
    title: {
      fr: 'Consultations',
      ar: 'الاستشارات',
    },
    manageConsultations: {
      fr: 'Gérer toutes les sessions de consultation',
      ar: 'إدارة جميع جلسات الاستشارة',
    },
    newConsultation: {
      fr: 'Nouvelle consultation',
      ar: 'استشارة جديدة',
    },
    client: {
      fr: 'Client',
      ar: 'العميل',
    },
    service: {
      fr: 'Service',
      ar: 'الخدمة',
    },
    consultant: {
      fr: 'Consultant',
      ar: 'المستشار',
    },
    date: {
      fr: 'Date',
      ar: 'التاريخ',
    },
    duration: {
      fr: 'Durée',
      ar: 'المدة',
    },
    status: {
      fr: 'Statut',
      ar: 'الحالة',
    },
    actions: {
      fr: 'Actions',
      ar: 'الإجراءات',
    },
    scheduled: {
      fr: 'Planifiée',
      ar: 'مجدولة',
    },
    inProgress: {
      fr: 'En cours',
      ar: 'قيد التنفيذ',
    },
    completed: {
      fr: 'Terminée',
      ar: 'مكتملة',
    },
    cancelled: {
      fr: 'Annulée',
      ar: 'ملغاة',
    },
    total: {
      fr: 'Total',
      ar: 'الإجمالي',
    },
    revenue: {
      fr: 'Revenu',
      ar: 'الإيرادات',
    },
    totalEarned: {
      fr: 'Total gagné',
      ar: 'إجمالي المكتسب',
    },
    upcoming: {
      fr: 'À venir',
      ar: 'القادمة',
    },
    activeNow: {
      fr: 'Actif maintenant',
      ar: 'نشط الآن',
    },
    consultationDetails: {
      fr: 'Détails de la consultation',
      ar: 'تفاصيل الاستشارة',
    },
    clientName: {
      fr: 'Nom du client',
      ar: 'اسم العميل',
    },
    serviceType: {
      fr: 'Type de service',
      ar: 'نوع الخدمة',
    },
    fee: {
      fr: 'Frais',
      ar: 'الرسوم',
    },
    notes: {
      fr: 'Notes',
      ar: 'ملاحظات',
    },
    editConsultation: {
      fr: 'Modifier la consultation',
      ar: 'تعديل الاستشارة',
    },
    noConsultationsFound: {
      fr: 'Aucune consultation trouvée',
      ar: 'لا توجد استشارات',
    },
    online: {
      fr: 'En ligne',
      ar: 'عبر الإنترنت',
      en: 'Online',
    },
    onsite: {
      fr: 'En présentiel',
      ar: 'في الموقع',
      en: 'On-site',
    },
    minutes: {
      fr: 'minutes',
      ar: 'دقائق',
      en: 'minutes',
    },
  },

  // Bookings
  bookings: {
    title: {
      fr: 'Réservations',
      ar: 'الحجوزات',
      en: 'Bookings',
    },
    manageBookings: {
      fr: 'Gérer toutes les réservations',
      ar: 'إدارة جميع الحجوزات',
      en: 'Manage all bookings',
    },
    myBookings: {
      fr: 'Mes réservations',
      ar: 'حجوزاتي',
      en: 'My Bookings',
    },
    viewManage: {
      fr: 'Voir et gérer vos rendez-vous de consultation',
      ar: 'عرض وإدارة مواعيد الاستشارة الخاصة بك',
      en: 'View and manage your consultation appointments',
    },
    newBooking: {
      fr: 'Nouvelle réservation',
      ar: 'حجز جديد',
      en: 'New Booking',
    },
    bookingDate: {
      fr: 'Date de réservation',
      ar: 'تاريخ الحجز',
      en: 'Booking Date',
    },
    topic: {
      fr: 'Sujet',
      ar: 'الموضوع',
      en: 'Topic',
    },
    pending: {
      fr: 'En attente',
      ar: 'قيد الانتظار',
      en: 'Pending',
    },
    confirmed: {
      fr: 'Confirmée',
      ar: 'مؤكدة',
      en: 'Confirmed',
    },
    rejected: {
      fr: 'Rejetée',
      ar: 'مرفوضة',
      en: 'Rejected',
    },
    viewDetails: {
      fr: 'Voir les détails',
      ar: 'عرض التفاصيل',
      en: 'View Details',
    },
    confirmBooking: {
      fr: 'Confirmer la réservation',
      ar: 'تأكيد الحجز',
      en: 'Confirm Booking',
    },
    rejectBooking: {
      fr: 'Rejeter la réservation',
      ar: 'رفض الحجز',
      en: 'Reject Booking',
    },
    all: {
      fr: 'Tout',
      ar: 'الكل',
      en: 'All',
    },
    upcoming: {
      fr: 'À venir',
      ar: 'القادمة',
      en: 'Upcoming',
    },
    past: {
      fr: 'Passées',
      ar: 'السابقة',
      en: 'Past',
    },
    noBookings: {
      fr: 'Aucune réservation trouvée',
      ar: 'لم يتم العثور على حجوزات',
      en: 'No bookings found',
    },
    online: {
      fr: 'En ligne',
      ar: 'عبر الإنترنت',
      en: 'Online',
    },
    onsite: {
      fr: 'En présentiel',
      ar: 'في الموقع',
      en: 'On-site',
    },
    minutes: {
      fr: 'min',
      ar: 'دقيقة',
      en: 'min',
    },
    confirmCancel: {
      fr: 'Êtes-vous sûr de vouloir annuler cette réservation?',
      ar: 'هل أنت متأكد من إلغاء هذا الحجز؟',
      en: 'Are you sure you want to cancel this booking?',
    },
    joinMeeting: {
      fr: 'Rejoindre la réunion',
      ar: 'الانضمام إلى الاجتماع',
      en: 'Join Meeting',
    },
    adminNote: {
      fr: 'Note de l\'admin',
      ar: 'ملاحظة الأدمن',
      en: 'Admin Note',
    },
    ended: {
      fr: 'Cette consultation est terminée',
      ar: 'انتهت هذه الاستشارة',
      en: 'This consultation has ended',
    },
    duration: {
      fr: 'Durée',
      ar: 'المدة',
      en: 'Duration',
    },
    type: {
      fr: 'Type',
      ar: 'النوع',
      en: 'Type',
    },
    consultant: {
      fr: 'Consultant',
      ar: 'المستشار',
      en: 'Consultant',
    },
    price: {
      fr: 'Prix',
      ar: 'السعر',
      en: 'Price',
    },
    notes: {
      fr: 'Notes',
      ar: 'ملاحظات',
      en: 'Notes',
    },
  },

  // Notifications
  notifications: {
    title: {
      fr: 'Notifications',
      ar: 'الإشعارات',
    },
    allCaughtUp: {
      fr: 'Tout est à jour!',
      ar: 'كل شيء محدث!',
    },
    unreadNotifications: {
      fr: 'notifications non lues',
      ar: 'إشعارات غير مقروءة',
    },
    markAllAsRead: {
      fr: 'Tout marquer comme lu',
      ar: 'تعليم الكل كمقروء',
    },
    markAsRead: {
      fr: 'Marquer comme lu',
      ar: 'تعليم كمقروء',
    },
    deleteAllRead: {
      fr: 'Supprimer tout lu',
      ar: 'حذف الكل المقروء',
    },
    noNotifications: {
      fr: 'Aucune notification',
      ar: 'لا توجد إشعارات',
    },
    noUnreadNotifications: {
      fr: 'Aucune notification non lue',
      ar: 'لا توجد إشعارات غير مقروءة',
    },
    noReadNotifications: {
      fr: 'Aucune notification lue',
      ar: 'لا توجد إشعارات مقروءة',
    },
    unread: {
      fr: 'Non lues',
      ar: 'غير مقروءة',
    },
    read: {
      fr: 'Lues',
      ar: 'مقروءة',
    },
    viewDetails: {
      fr: 'Voir les détails',
      ar: 'عرض التفاصيل',
    },
    booking: {
      fr: 'Réservation',
      ar: 'حجز',
    },
    reminder: {
      fr: 'Rappel',
      ar: 'تذكير',
    },
    message: {
      fr: 'Message',
      ar: 'رسالة',
    },
    system: {
      fr: 'Système',
      ar: 'نظام',
    },
    sendNotification: {
      fr: 'Envoyer une notification',
      ar: 'إرسال إشعار',
    },
    notificationSent: {
      fr: 'Notification envoyée avec succès',
      ar: 'تم إرسال الإشعار بنجاح',
    },
    selectUser: {
      fr: 'Sélectionner un utilisateur',
      ar: 'اختر مستخدم',
    },
    selectType: {
      fr: 'Sélectionner le type',
      ar: 'اختر النوع',
    },
    notificationTitle: {
      fr: 'Titre de la notification',
      ar: 'عنوان الإشعار',
    },
    notificationMessage: {
      fr: 'Message de la notification',
      ar: 'نص الإشعار',
    },
  },

  // Messages/Contacts
  messages: {
    title: {
      fr: 'Messages',
      ar: 'الرسائل',
    },
    newMessage: {
      fr: 'Nouveau message',
      ar: 'رسالة جديدة',
    },
    reply: {
      fr: 'Répondre',
      ar: 'رد',
    },
    subject: {
      fr: 'Sujet',
      ar: 'الموضوع',
    },
    message: {
      fr: 'Message',
      ar: 'الرسالة',
    },
    from: {
      fr: 'De',
      ar: 'من',
    },
    to: {
      fr: 'À',
      ar: 'إلى',
    },
    sentAt: {
      fr: 'Envoyé le',
      ar: 'أرسل في',
    },
  },

  // Users
  users: {
    title: {
      fr: 'Utilisateurs',
      ar: 'المستخدمون',
    },
    manageUsers: {
      fr: 'Gérer tous les utilisateurs',
      ar: 'إدارة جميع المستخدمين',
    },
    addUser: {
      fr: 'Ajouter un utilisateur',
      ar: 'إضافة مستخدم',
    },
    userName: {
      fr: 'Nom d\'utilisateur',
      ar: 'اسم المستخدم',
    },
    role: {
      fr: 'Rôle',
      ar: 'الدور',
    },
    joinedDate: {
      fr: 'Date d\'inscription',
      ar: 'تاريخ الانضمام',
    },
    active: {
      fr: 'Actif',
      ar: 'نشط',
    },
    inactive: {
      fr: 'Inactif',
      ar: 'غير نشط',
    },
    admin: {
      fr: 'Administrateur',
      ar: 'مدير',
    },
    user: {
      fr: 'Utilisateur',
      ar: 'مستخدم',
    },
    superAdmin: {
      fr: 'Super administrateur',
      ar: 'مدير أعلى',
    },
  },

  // Status messages
  status: {
    accessDenied: {
      fr: 'Accès refusé',
      ar: 'الوصول مرفوض',
    },
    accessDeniedMessage: {
      fr: 'Vous n\'avez pas les privilèges administrateur pour accéder à cette zone. Veuillez contacter votre administrateur.',
      ar: 'ليس لديك صلاحيات إدارية للوصول إلى هذه المنطقة. يرجى الاتصال بالمدير.',
    },
    goToHomepage: {
      fr: 'Aller à l\'accueil',
      ar: 'الذهاب للصفحة الرئيسية',
    },
    loadingDashboard: {
      fr: 'Chargement du tableau de bord...',
      ar: 'جاري تحميل لوحة التحكم...',
    },
    loadingConsultations: {
      fr: 'Chargement des consultations...',
      ar: 'جاري تحميل الاستشارات...',
    },
    loadingNotifications: {
      fr: 'Chargement des notifications...',
      ar: 'جاري تحميل الإشعارات...',
    },
  },

  // Company info
  company: {
    name: {
      fr: 'Sygma Consult',
      ar: 'سيجما كونسلت',
    },
    tagline: {
      fr: 'Paris • Tunis',
      ar: 'باريس • تونس',
    },
    description: {
      fr: 'Votre partenaire de confiance pour les solutions de conseil d\'entreprise',
      ar: 'شريكك الموثوق لحلول الاستشارات التجارية',
    },
  },

  // Calendar Management
  calendar: {
    title: {
      fr: 'Gestion du calendrier',
      ar: 'إدارة التقويم',
      en: 'Calendar Management',
    },
    description: {
      fr: 'Gérer les horaires disponibles et les dates bloquées',
      ar: 'إدارة الأوقات المتاحة والتواريخ المحجوبة',
      en: 'Manage available times and blocked dates',
    },
    timeSlots: {
      fr: 'Créneaux horaires',
      ar: 'الأوقات المتاحة',
      en: 'Time Slots',
    },
    addSlot: {
      fr: 'Ajouter un créneau',
      ar: 'إضافة وقت',
      en: 'Add Slot',
    },
    dayOfWeek: {
      fr: 'Jour de la semaine',
      ar: 'يوم الأسبوع',
      en: 'Day of Week',
    },
    startTime: {
      fr: 'Heure de début',
      ar: 'وقت البداية',
      en: 'Start Time',
    },
    endTime: {
      fr: 'Heure de fin',
      ar: 'وقت النهاية',
      en: 'End Time',
    },
    slotDuration: {
      fr: 'Durée du créneau',
      ar: 'مدة الفترة',
      en: 'Slot Duration',
    },
    available: {
      fr: 'Disponible',
      ar: 'متاح',
      en: 'Available',
    },
    unavailable: {
      fr: 'Indisponible',
      ar: 'غير متاح',
      en: 'Unavailable',
    },
    noSlots: {
      fr: 'Aucun créneau pour ce jour',
      ar: 'لا توجد أوقات لهذا اليوم',
      en: 'No slots for this day',
    },
    blockedDates: {
      fr: 'Dates bloquées',
      ar: 'التواريخ المحجوبة',
      en: 'Blocked Dates',
    },
    blockDate: {
      fr: 'Bloquer une date',
      ar: 'حجب تاريخ',
      en: 'Block Date',
    },
    noBlockedDates: {
      fr: 'Aucune date bloquée',
      ar: 'لا توجد تواريخ محجوبة',
      en: 'No blocked dates',
    },
    reason: {
      fr: 'Raison',
      ar: 'السبب',
      en: 'Reason',
    },
    enterReason: {
      fr: 'Entrez la raison du blocage',
      ar: 'أدخل سبب الحجب',
      en: 'Enter reason for blocking',
    },
    fillAllFields: {
      fr: 'Veuillez remplir tous les champs',
      ar: 'يرجى ملء جميع الحقول',
      en: 'Please fill all fields',
    },
    slotAdded: {
      fr: 'Créneau ajouté avec succès',
      ar: 'تم إضافة الوقت بنجاح',
      en: 'Slot added successfully',
    },
    errorAddingSlot: {
      fr: 'Erreur lors de l\'ajout du créneau',
      ar: 'خطأ في إضافة الوقت',
      en: 'Error adding slot',
    },
    confirmDeleteSlot: {
      fr: 'Êtes-vous sûr de vouloir supprimer ce créneau?',
      ar: 'هل أنت متأكد من حذف هذا الوقت؟',
      en: 'Are you sure you want to delete this slot?',
    },
    slotDeleted: {
      fr: 'Créneau supprimé avec succès',
      ar: 'تم حذف الوقت بنجاح',
      en: 'Slot deleted successfully',
    },
    errorDeletingSlot: {
      fr: 'Erreur lors de la suppression du créneau',
      ar: 'خطأ في حذف الوقت',
      en: 'Error deleting slot',
    },
    availabilityUpdated: {
      fr: 'Disponibilité mise à jour',
      ar: 'تم تحديث التوفر',
      en: 'Availability updated',
    },
    errorUpdatingAvailability: {
      fr: 'Erreur lors de la mise à jour de la disponibilité',
      ar: 'خطأ في تحديث التوفر',
      en: 'Error updating availability',
    },
    dateBlocked: {
      fr: 'Date bloquée avec succès',
      ar: 'تم حجب التاريخ بنجاح',
      en: 'Date blocked successfully',
    },
    errorBlockingDate: {
      fr: 'Erreur lors du blocage de la date',
      ar: 'خطأ في حجب التاريخ',
      en: 'Error blocking date',
    },
    confirmUnblock: {
      fr: 'Êtes-vous sûr de vouloir débloquer cette date?',
      ar: 'هل أنت متأكد من إلغاء حجب هذا التاريخ؟',
      en: 'Are you sure you want to unblock this date?',
    },
    dateUnblocked: {
      fr: 'Date débloquée avec succès',
      ar: 'تم إلغاء حجب التاريخ بنجاح',
      en: 'Date unblocked successfully',
    },
    errorUnblockingDate: {
      fr: 'Erreur lors du déblocage de la date',
      ar: 'خطأ في إلغاء حجب التاريخ',
      en: 'Error unblocking date',
    },
  },

  // Appointments
  appointments: {
    title: {
      fr: 'Réserver un rendez-vous',
      ar: 'احجز موعدك',
      en: 'Book Your Appointment',
    },
    subtitle: {
      fr: 'Choisissez la date et l\'heure qui vous conviennent',
      ar: 'اختر التاريخ والوقت المناسب لك',
      en: 'Choose the date and time that suits you',
    },
    bookAppointment: {
      fr: 'Réserver',
      ar: 'حجز موعد',
      en: 'Book Appointment',
    },
    selectedDate: {
      fr: 'Date sélectionnée',
      ar: 'التاريخ المحدد',
      en: 'Selected Date',
    },
    appointmentType: {
      fr: 'Type de rendez-vous',
      ar: 'نوع الموعد',
      en: 'Appointment Type',
    },
    selectType: {
      fr: 'Choisir le type',
      ar: 'اختر نوع الموعد',
      en: 'Select Type',
    },
    timeSlot: {
      fr: 'Heure',
      ar: 'الوقت',
      en: 'Time',
    },
    noAvailableSlots: {
      fr: 'Aucun créneau disponible',
      ar: 'لا توجد أوقات متاحة',
      en: 'No available slots',
    },
    fullName: {
      fr: 'Nom complet',
      ar: 'الاسم الكامل',
      en: 'Full Name',
    },
    enterName: {
      fr: 'Entrez votre nom',
      ar: 'أدخل اسمك',
      en: 'Enter your name',
    },
    phone: {
      fr: 'Téléphone',
      ar: 'رقم الهاتف',
      en: 'Phone',
    },
    notes: {
      fr: 'Notes',
      ar: 'ملاحظات',
      en: 'Notes',
    },
    additionalNotes: {
      fr: 'Commentaires additionnels...',
      ar: 'أي ملاحظات إضافية...',
      en: 'Additional comments...',
    },
    confirmBooking: {
      fr: 'Confirmer',
      ar: 'تأكيد الحجز',
      en: 'Confirm',
    },
    bookingSuccess: {
      fr: 'Rendez-vous réservé avec succès!',
      ar: 'تم حجز الموعد بنجاح!',
      en: 'Appointment booked successfully!',
    },
    bookingError: {
      fr: 'Erreur lors de la réservation',
      ar: 'خطأ في حجز الموعد',
      en: 'Error booking appointment',
    },
    fillAllFields: {
      fr: 'Veuillez remplir tous les champs',
      ar: 'يرجى ملء جميع الحقول',
      en: 'Please fill all fields',
    },
    upcomingAppointments: {
      fr: 'Rendez-vous à venir',
      ar: 'المواعيد القادمة',
      en: 'Upcoming Appointments',
    },
    noAppointments: {
      fr: 'Aucun rendez-vous',
      ar: 'لا توجد مواعيد',
      en: 'No appointments',
    },
    status: {
      fr: 'Statut',
      ar: 'الحالة',
      en: 'Status',
    },
    pending: {
      fr: 'En attente',
      ar: 'قيد الانتظار',
      en: 'Pending',
    },
    confirmed: {
      fr: 'Confirmé',
      ar: 'مؤكد',
      en: 'Confirmed',
    },
    cancelled: {
      fr: 'Annulé',
      ar: 'ملغي',
      en: 'Cancelled',
    },
    completed: {
      fr: 'Terminé',
      ar: 'مكتمل',
      en: 'Completed',
    },
    duration: {
      fr: 'Durée',
      ar: 'المدة',
      en: 'Duration',
    },
    minutes: {
      fr: 'minutes',
      ar: 'دقيقة',
      en: 'minutes',
    },
    price: {
      fr: 'Prix',
      ar: 'السعر',
      en: 'Price',
    },
  },

  // Additional UI elements
  ui: {
    loading: {
      fr: 'Chargement...',
      ar: 'جاري التحميل...',
      en: 'Loading...',
    },
    loadingDashboard: {
      fr: 'Chargement du tableau de bord...',
      ar: 'جاري تحميل لوحة التحكم...',
      en: 'Loading dashboard...',
    },
    loadingDocuments: {
      fr: 'Chargement des documents...',
      ar: 'جاري تحميل المستندات...',
      en: 'Loading documents...',
    },
    loadingNotifications: {
      fr: 'Chargement des notifications...',
      ar: 'جاري تحميل الإشعارات...',
      en: 'Loading notifications...',
    },
    uploadDocument: {
      fr: 'Télécharger un document',
      ar: 'تحميل مستند',
      en: 'Upload Document',
    },
    deleteConfirm: {
      fr: 'Êtes-vous sûr de vouloir supprimer ?',
      ar: 'هل أنت متأكد من الحذف؟',
      en: 'Are you sure you want to delete?',
    },
    deleteNotificationConfirm: {
      fr: 'Êtes-vous sûr de vouloir supprimer cette notification ?',
      ar: 'هل أنت متأكد من حذف هذا الإشعار؟',
      en: 'Are you sure you want to delete this notification?',
    },
    deleteAllReadConfirm: {
      fr: 'Êtes-vous sûr de vouloir supprimer toutes les notifications lues ?',
      ar: 'هل أنت متأكد من حذف جميع الإشعارات المقروءة؟',
      en: 'Are you sure you want to delete all read notifications?',
    },
    markAsRead: {
      fr: 'Marquer comme lu',
      ar: 'تحديد كمقروء',
      en: 'Mark as read',
    },
    deleteAllRead: {
      fr: 'Supprimer tout ce qui est lu',
      ar: 'حذف جميع المقروء',
      en: 'Delete all read',
    },
    unread: {
      fr: 'Non lu',
      ar: 'غير مقروء',
      en: 'Unread',
    },
    read: {
      fr: 'Lu',
      ar: 'مقروء',
      en: 'Read',
    },
    justNow: {
      fr: 'À l\'instant',
      ar: 'الآن',
      en: 'Just now',
    },
    minutesAgo: {
      fr: 'm il y a',
      ar: 'د منذ',
      en: 'm ago',
    },
    hoursAgo: {
      fr: 'h il y a',
      ar: 'س منذ',
      en: 'h ago',
    },
    daysAgo: {
      fr: 'j il y a',
      ar: 'ي منذ',
      en: 'd ago',
    },
    noUnreadNotifications: {
      fr: 'Aucune notification non lue',
      ar: 'لا توجد إشعارات غير مقروءة',
      en: 'No unread notifications',
    },
    noReadNotifications: {
      fr: 'Aucune notification lue',
      ar: 'لا توجد إشعارات مقروءة',
      en: 'No read notifications',
    },
    noNotificationsYet: {
      fr: 'Aucune notification pour le moment',
      ar: 'لا توجد إشعارات بعد',
      en: 'No notifications yet',
    },
    allCaughtUp: {
      fr: 'Tout est à jour !',
      ar: 'كل شيء محدث!',
      en: 'All caught up!',
    },
    viewDetails: {
      fr: 'Voir les détails →',
      ar: 'عرض التفاصيل ←',
      en: 'View details →',
    },
    noDocumentsYet: {
      fr: 'Aucun document téléchargé',
      ar: 'لم يتم تحميل مستندات بعد',
      en: 'No documents uploaded yet',
    },
    uploadFirstDocument: {
      fr: 'Télécharger votre premier document',
      ar: 'تحميل أول مستند',
      en: 'Upload Your First Document',
    },
    supportedFormats: {
      fr: 'Formats supportés : PDF, DOC, DOCX, JPG, PNG. Taille maximale : 10 Mo',
      ar: 'الصيغ المدعومة: PDF, DOC, DOCX, JPG, PNG. الحد الأقصى: 10 ميجابايت',
      en: 'Supported formats: PDF, DOC, DOCX, JPG, PNG. Maximum file size: 10MB',
    },
    size: {
      fr: 'Taille',
      ar: 'الحجم',
      en: 'Size',
    },
    category: {
      fr: 'Catégorie',
      ar: 'الفئة',
      en: 'Category',
    },
    uploaded: {
      fr: 'Téléchargé',
      ar: 'تم التحميل',
      en: 'Uploaded',
    },
    failedUpload: {
      fr: 'Échec du téléchargement. Veuillez réessayer.',
      ar: 'فشل التحميل. يرجى المحاولة مرة أخرى.',
      en: 'Failed to upload file. Please try again.',
    },
  },
};

// Helper function to get translation
export function t(key: string, lang: Language = 'fr'): string {
  const keys = key.split('.');
  let value: any = translations;

  for (const k of keys) {
    value = value?.[k];
    if (!value) break;
  }

  return value?.[lang] || key;
}

// Helper function to get current language from localStorage
export function getCurrentLanguage(): Language {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('language');
    return (saved === 'ar' || saved === 'fr') ? saved : 'fr';
  }
  return 'fr';
}

// Helper function to set language
export function setLanguage(lang: Language): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('language', lang);
    // Update HTML dir attribute for RTL support
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }
}
