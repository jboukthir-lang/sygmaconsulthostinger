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
      en: 'Welcome',
    },
    city: {
      fr: 'Ville',
      ar: 'المدينة',
      en: 'City',
    },
    viewDetails: {
      fr: 'Voir les détails',
      ar: 'عرض التفاصيل',
      en: 'View Details',
    },
    userDetails: {
      fr: 'Détails de l\'utilisateur',
      ar: 'تفاصيل المستخدم',
      en: 'User Details',
    },
    registeredOn: {
      fr: 'Inscrit le',
      ar: 'انضم في',
      en: 'Registered on',
    },
    fullAddress: {
      fr: 'Adresse complète',
      ar: 'العنوان بالكامل',
      en: 'Full Address',
    },
    loadingNotifications: {
      fr: 'Chargement des notifications...',
      ar: 'جاري تحميل التنبيهات...',
      en: 'Loading notifications...',
    },
    userNotifications: {
      fr: 'Notifications de l\'utilisateur',
      ar: 'تنبيهات المستخدم',
      en: 'User Notifications',
    },
    noNotificationsYet: {
      fr: 'Cet utilisateur n\'a pas encore de notifications',
      ar: 'هذا المستخدم ليس لديه تنبيهات بعد',
      en: 'This user has no notifications yet',
    },
    loading: {
      fr: 'Chargement...',
      ar: 'جاري التحميل...',
      en: 'Loading...',
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
      en: 'Information',
    },
    subject: {
      fr: 'Sujet',
      ar: 'الموضوع',
      en: 'Subject',
    },
    message: {
      fr: 'Message',
      ar: 'الرسالة',
      en: 'Message',
    },
    category: {
      fr: 'Catégorie',
      ar: 'الفئة',
      en: 'Category',
    },
    views: {
      fr: 'Vues',
      ar: 'المشاهدات',
      en: 'Views',
    },
    actions: {
      fr: 'Actions',
      ar: 'الإجراءات',
      en: 'Actions',
    },
    status: {
      fr: 'Statut',
      ar: 'الحالة',
      en: 'Status',
    },
    dateAndTime: {
      fr: 'Date et heure',
      ar: 'التاريخ والوقت',
      en: 'Date & Time',
    },
    duration: {
      fr: 'Durée',
      ar: 'المدة',
      en: 'Duration',
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
    calendar: {
      fr: 'Calendrier et rendez-vous',
      ar: 'التقويم والمواعيد',
      en: 'Calendar and Appointments',
    },
    posts: {
      fr: 'Articles',
      ar: 'المنشورات',
      en: 'Posts',
    },
    services: {
      fr: 'Services',
      ar: 'الخدمات',
      en: 'Services',
    },
    heroImage: {
      fr: 'Image d\'accueil',
      ar: 'صورة الصفحة الرئيسية',
      en: 'Hero Image',
    },
    notifications: {
      fr: 'Notifications',
      ar: 'التنبيهات',
      en: 'Notifications',
    },
    markAllAsRead: {
      fr: 'Tout marquer comme lu',
      ar: 'تعيين الكل كمقروء',
      en: 'Mark all as read',
    },
    noNotifications: {
      fr: 'Aucune notification',
      ar: 'لا توجد تنبيهات',
      en: 'No notifications',
    },
    viewAllHistory: {
      fr: 'Voir tout l\'historique',
      ar: 'عرض سجل التنبيهات بالكامل',
      en: 'View all history',
    },
    accessDenied: {
      fr: 'Accès refusé',
      ar: 'تم رفض الوصول',
      en: 'Access Denied',
    },
    accessDeniedMessage: {
      fr: 'Vous n\'avez pas les privilèges administratifs pour accéder à cette zone. Veuillez contacter votre administrateur.',
      ar: 'ليس لديك صلاحيات أدمن للوصول إلى هذه المنطقة. يرجى الاتصال بالمسؤول.',
      en: 'You don\'t have admin privileges to access this area. Please contact your administrator.',
    },
    goToHomepage: {
      fr: 'Aller à l\'accueil',
      ar: 'العودة للصفحة الرئيسية',
      en: 'Go to Homepage',
    },
    searchPlaceholder: {
      fr: 'Rechercher...',
      ar: 'بحث...',
      en: 'Search...',
    },
    superAdmin: {
      fr: 'Super administrateur',
      ar: 'مدير عام',
      en: 'Super Admin',
    },
    adminUser: {
      fr: 'Utilisateur Admin',
      ar: 'مستخدم أدمن',
      en: 'Admin User',
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
    france: {
      fr: 'France',
      ar: 'فرنسا',
      en: 'France',
    },
    tunisia: {
      fr: 'Tunisie',
      ar: 'تونس',
      en: 'Tunisia',
    },
    morocco: {
      fr: 'Maroc',
      ar: 'المغرب',
      en: 'Morocco',
    },
    algeria: {
      fr: 'Algérie',
      ar: 'الجزائر',
      en: 'Algeria',
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
      en: 'Dashboard',
    },
    welcomeBack: {
      fr: 'Bon retour ! Voici ce qui se passe aujourd\'hui.',
      ar: 'مرحباً بعودتك! إليك ما يحدث اليوم.',
      en: 'Welcome back! Here\'s what\'s happening today.',
    },
    stats: {
      totalBookings: {
        fr: 'Total des réservations',
        ar: 'إجمالي الحجوزات',
        en: 'Total Bookings',
      },
      newMessages: {
        fr: 'Nouveaux messages',
        ar: 'رسائل جديدة',
        en: 'New Messages',
      },
      registeredUsers: {
        fr: 'Utilisateurs enregistrés',
        ar: 'المستخدمون المسجلون',
        en: 'Registered Users',
      },
      blogPosts: {
        fr: 'Articles de blog',
        ar: 'منشورات المدونة',
        en: 'Blog Posts',
      },
      conversionRate: {
        fr: 'Taux de conversion',
        ar: 'معدل التحويل',
        en: 'Conversion Rate',
      },
      pending: {
        fr: 'en attente',
        ar: 'قيد الانتظار',
        en: 'pending',
      },
      total: {
        fr: 'au total',
        ar: 'إجمالي',
        en: 'total',
      },
      published: {
        fr: 'publiés',
        ar: 'منشورة',
        en: 'published',
      },
    },
    recentBookings: {
      fr: 'Réservations récentes',
      ar: 'الحجوزات الأخيرة',
      en: 'Recent Bookings',
    },
    noBookingsYet: {
      fr: 'Aucune réservation pour le moment',
      ar: 'لا توجد حجوزات بعد',
      en: 'No bookings yet',
    },
    quickActions: {
      fr: 'Actions rapides',
      ar: 'إجراءات سريعة',
      en: 'Quick Actions',
      confirmPending: {
        fr: 'Confirmer les réservations en attente',
        ar: 'تأكيد الحجوزات المعلقة',
        en: 'Confirm Pending Bookings',
      },
      replyMessages: {
        fr: 'Répondre aux messages',
        ar: 'الرد على الرسائل',
        en: 'Reply to Messages',
      },
      managePosts: {
        fr: 'Gérer les articles de blog',
        ar: 'إدارة منشورات المدونة',
        en: 'Manage Blog Posts',
      },
      todaySchedule: {
        fr: 'Emploi du temps d\'aujourd\'hui',
        ar: 'جدول اليوم',
        en: 'Today\'s Schedule',
      },
    },
    consultations: {
      title: { fr: 'Consultations', ar: 'الاستشارات', en: 'Consultations' },
      subtitle: { fr: 'Gérer toutes les sessions de consultation', ar: 'إدارة جميع جلسات الاستشارة', en: 'Manage all consultation sessions' },
      new: { fr: 'Nouvelle consultation', ar: 'استشارة جديدة', en: 'New Consultation' },
      pending: { fr: 'En attente', ar: 'قيد الانتظار', en: 'Pending' },
      total: { fr: 'Total', ar: 'الإجمالي', en: 'Total' },
      scheduled: { fr: 'Planifiées', ar: 'المجدولة', en: 'Scheduled' },
      upcoming: { fr: 'À venir', ar: 'القادمة', en: 'Upcoming' },
      inProgress: { fr: 'En cours', ar: 'قيد التنفيذ', en: 'In Progress' },
      activeNow: { fr: 'Actif maintenant', ar: 'نشط الآن', en: 'Active now' },
      completed: { fr: 'Terminées', ar: 'مكتملة', en: 'Completed' },
      revenue: { fr: 'Revenu', ar: 'الإيرادات', en: 'Revenue' },
      totalEarned: { fr: 'Total gagné', ar: 'إجمالي المكتسب', en: 'Total earned' },
      searchPlaceholder: { fr: 'Rechercher par nom, email ou service...', ar: 'بحث بالاسم أو البريد أو الخدمة...', en: 'Search by client name, email, or service...' },
      noConsultations: { fr: 'Aucune consultation trouvée', ar: 'لم يتم العثور على استشارات', en: 'No consultations found' },
      details: { fr: 'Détails de la consultation', ar: 'تفاصيل الاستشارة', en: 'Consultation Details' },
      changeStatus: { fr: 'Changer le statut', ar: 'تغيير الحالة', en: 'Change Status' },
      assignConsultant: { fr: 'Assigner un consultant', ar: 'تعيين مستشار', en: 'Assign Consultant' },
      unassigned: { fr: 'Non assigné', ar: 'غير معين', en: 'Unassigned' },
      fee: { fr: 'Frais de consultation (€)', ar: 'رسوم الاستشارة (€)', en: 'Consultation Fee (€)' },
      meetingLink: { fr: 'Lien de la réunion', ar: 'رابط الاجتماع', en: 'Meeting Link (Join)' },
      clientNotes: { fr: 'Notes du client', ar: 'ملاحظات العميل', en: 'Client Notes' },
      noClientNotes: { fr: 'Aucune note fournie par le client.', ar: 'لا توجد ملاحظات من العميل.', en: 'No client notes provided.' },
      internalNotes: { fr: 'Notes internes de l\'admin', ar: 'ملاحظات إدارية داخلية', en: 'Internal Admin Notes' },
      addInternalNotes: { fr: 'Ajouter des notes internes...', ar: 'إضافة ملاحظات داخلية...', en: 'Add internal notes for consultants...' },
      deleteConfirm: { fr: 'Êtes-vous sûr de vouloir supprimer cette consultation ? Cette action est irréversible.', ar: 'هل أنت متأكد من حذف هذه الاستشارة؟ لا يمكن التراجع عن هذا الإجراء.', en: 'Are you sure you want to delete this consultation? This action cannot be undone.' },
      loading: { fr: 'Chargement des consultations...', ar: 'جاري تحميل الاستشارات...', en: 'Loading consultations...' },
    },
    messages: {
      title: { fr: 'Messages', ar: 'الرسائل', en: 'Messages' },
      subtitle: { fr: 'Gérer les soumissions du formulaire de contact', ar: 'إدارة رسائل نموذج الاتصال', en: 'Manage contact form submissions' },
      new: { fr: 'Nouveau', ar: 'جديد', en: 'New' },
      searchPlaceholder: { fr: 'Rechercher des messages...', ar: 'بحث في الرسائل...', en: 'Search messages...' },
      details: { fr: 'Détails du message', ar: 'تفاصيل الرسالة', en: 'Message Details' },
      from: { fr: 'De', ar: 'من', en: 'From' },
      received: { fr: 'Reçu le', ar: 'استلم في', en: 'Received' },
      replyViaEmail: { fr: 'Répondre par email', ar: 'الرد عبر البريد', en: 'Reply via Email' },
      loading: { fr: 'Chargement des messages...', ar: 'جاري تحميل الرسائل...', en: 'Loading messages...' },
    },
    posts: {
      title: { fr: 'Gestion des articles', ar: 'إدارة المنشورات', en: 'Posts Management' },
      subtitle: { fr: 'Créer et gérer les articles de blog pour votre site', ar: 'إنشاء وإدارة منشورات المدونة لموقعك', en: 'Create and manage blog posts for your website' },
      newPost: { fr: 'Nouvel article', ar: 'منشور جديد', en: 'New Post' },
      totalPosts: { fr: 'Total des articles', ar: 'إجمالي المنشورات', en: 'Total Posts' },
      published: { fr: 'Publiés', ar: 'المنشورة', en: 'Published' },
      drafts: { fr: 'Brouillons', ar: 'المسودات', en: 'Drafts' },
      totalViews: { fr: 'Total des vues', ar: 'إجمالي المشاهدات', en: 'Total Views' },
      searchPlaceholder: { fr: 'Rechercher par titre ou catégorie...', ar: 'بحث بالعنوان أو الفئة...', en: 'Search posts by title or category...' },
      noPosts: { fr: 'Aucun article trouvé. Créez votre premier article !', ar: 'لم يتم العثور على منشورات. أنشئ منشورك الأول للبدء!', en: 'No posts found. Create your first post to get started!' },
      deleteConfirm: { fr: 'Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible.', ar: 'هل أنت متأكد من حذف هذا المنشور؟ لا يمكن التراجع عن هذا الإجراء.', en: 'Are you sure you want to delete this post? This action cannot be undone.' },
      backToDashboard: { fr: 'Retour au tableau de bord', ar: 'العودة للوحة التحكم', en: 'Back to Dashboard' },
    },
    services: {
      title: { fr: 'Gestion des services', ar: 'إدارة الخدمات', en: 'Services Management' },
      subtitle: { fr: 'Gérer les services affichés sur votre site', ar: 'إدارة الخدمات المعروضة على موقعك', en: 'Manage services displayed on your website' },
      newService: { fr: 'Nouveau service', ar: 'خدمة جديدة', en: 'New Service' },
      totalServices: { fr: 'Total des services', ar: 'إجمالي الخدمات', en: 'Total Services' },
      active: { fr: 'Actifs', ar: 'النشطة', en: 'Active' },
      inactive: { fr: 'Inactifs', ar: 'غير النشطة', en: 'Inactive' },
      searchPlaceholder: { fr: 'Rechercher des services par titre...', ar: 'بحث في الخدمات بالعنوان...', en: 'Search services by title...' },
      icon: { fr: 'Icône', ar: 'أيقونة', en: 'Icon' },
      titleEn: { fr: 'Titre (EN)', ar: 'العنوان (EN)', en: 'Title (EN)' },
      status: { fr: 'Statut', ar: 'الحالة', en: 'Status' },
      order: { fr: 'Order', ar: 'الترتيب', en: 'Order' },
      noServices: { fr: 'Aucun service trouvé. Créez votre premier service !', ar: 'لم يتم العثور على خدمات. أنشئ خدمتك الأولى للبدء!', en: 'No services found. Create your first service to get started!' },
      editService: { fr: 'Modifier le service', ar: 'تعديل الخدمة', en: 'Edit Service' },
      activeDisplay: { fr: 'Actif (Afficher sur le site)', ar: 'نشط (عرض على الموقع)', en: 'Active (Display on website)' },
      deleteConfirm: { fr: 'Êtes-vous sûr de vouloir supprimer ce service ?', ar: 'هل أنت متأكد من حذف هذه الخدمة؟', en: 'Are you sure you want to delete this service?' },
      saveSuccess: { fr: 'Service enregistré avec succès !', ar: 'تم حفظ الخدمة بنجاح!', en: 'Service saved successfully!' },
      deleteSuccess: { fr: 'Supprimé avec succès !', ar: 'تم الحذف بنجاح!', en: 'Deleted successfully!' },
      saveError: { fr: 'Échec de l\'enregistrement du service', ar: 'فشل في حفظ الخدمة', en: 'Failed to save service' },
      deleteError: { fr: 'Échec de la suppression', ar: 'فشل في الحذف', en: 'Failed to delete' },
    },
    monthlyOverview: {
      fr: 'Aperçu mensuel',
      ar: 'نظرة عامة شهرية',
      en: 'Monthly Overview',
    },
    chartPlaceholder: {
      fr: 'Le graphique sera intégré ici',
      ar: 'سيتم دمج الرسم البياني هنا',
      en: 'Chart will be integrated here',
    },
    bookings: {
      fr: 'Réservations',
      ar: 'الحجوزات',
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

  // Service Details
  serviceDetails: {
    "strategic": {
      title: {
        fr: "Développement de Marché",
        ar: "تطوير الأسواق",
        en: "Market Development"
      },
      subtitle: {
        fr: "Pénétrez de Nouveaux Marchés avec Confiance",
        ar: "ادخل أسواقاً جديدة بثقة",
        en: "Penetrate New Markets with Confidence"
      },
      description: {
        fr: "Notre service 'Développement et Pénétration de Marché' offre des stratégies de croissance ambitieuses pour les entreprises souhaitant s'étendre en France ou en Afrique du Nord. Nous analysons la dynamique du marché, identifions les opportunités clés et créons une feuille de route pour un succès durable.",
        ar: "يقدم خبراؤنا استراتيجيات نمو طموحة للشركات التي تتطلع إلى التوسع في فرنسا أو شمال إفريقيا. نقوم بتحليل ديناميكيات السوق وتحديد الفرص الرئيسية وإنشاء خارطة طريق للنجاح المستدام.",
        en: "Our Market Development service provides ambitious growth strategies for businesses looking to expand into France or North Africa. We analyze market dynamics, identify key opportunities, and create a roadmap for sustainable success."
      },
      features: {
        fr: ["Stratégie d'entrée sur le marché", "Analyse concurrentielle", "Modélisation de la croissance", "Développement de partenariats"],
        ar: ["استراتيجية دخول السوق", "تحليل المنافسين", "نمذجة النمو", "تطوير الشراكات"],
        en: ["Market Entry Strategy", "Competitive Analysis", "Growth Modeling", "Partnership Development"]
      }
    },
    "financial-legal": {
      title: {
        fr: "Affaires et Fiscalité",
        ar: "الأعمال والضرائب",
        en: "Business & Tax"
      },
      subtitle: {
        fr: "Optimisation et Conformité",
        ar: "التحسين والامتثال",
        en: "Optimization and Compliance"
      },
      description: {
        fr: "Nous fournissons un soutien complet pour les fusions et acquisitions, la conformité fiscale et la restructuration d'entreprise. Nos experts veillent à ce que vos stratégies financières et fiscales soient optimisées pour les juridictions françaises et tunisiennes.",
        ar: "نقدم دعماً شاملاً لعمليات الدمج والاستحواذ والامتثال الضريبي وإعادة هيكلة الشركات. يضمن خبراؤنا تحسين استراتيجياتك المالية والضريبية لكل من الولايات القضائية الفرنسية والتونسية.",
        en: "We provide comprehensive support for M&A, tax compliance, and corporate restructuring. Our experts ensure your financial and tax strategies are optimized for both French and Tunisian jurisdictions."
      },
      features: {
        fr: ["Optimisation Fiscale", "Conformité Droit du Travail", "Restructuration d'Entreprise", "Audits Contractuels"],
        ar: ["التحسين الضريبي", "الامتثال لقانون العمل", "إعادة هيكلة الشركات", "التدقيق التعاقدي"],
        en: ["Tax Optimization", "Labor Law Compliance", "Corporate Restructuring", "Contractual Audits"]
      }
    },
    "visa": {
      title: {
        fr: "Procédures Visa",
        ar: "إجراءات التأشيرة",
        en: "Visa Procedures"
      },
      subtitle: {
        fr: "Faciliter Votre Mobilité",
        ar: "تسهيل تنقلك",
        en: "Facilitating Your Mobility"
      },
      description: {
        fr: "Nous facilitons toutes les procédures d'obtention de visas, que ce soit à des fins professionnelles ou personnelles. De la préparation des documents à la soumission aux autorités compétentes, nous offrons un accompagnement complet.",
        ar: "نحن نسهل جميع إجراءات الحصول على التأشيرات، سواء للأغراض المهنية أو الشخصية. من إعداد المستندات إلى تقديمها للسلطات المختصة، نقدم مرافقة كاملة لضمان عملية سلسة.",
        en: "We facilitate all procedures for obtaining visas, whether for professional or personal purposes. From document preparation to submission to competent authorities, we provide full accompaniment to ensure a smooth process."
      },
      features: {
        fr: ["Visas Professionnels (Passeport Talent)", "Visas Personnels & Familiaux", "Revue & Soumission de Dossier", "Renouvellement de Titre de Séjour"],
        ar: ["التأشيرات المهنية (جواز الموهبة)", "التأشيرات الشخصية والعائلية", "مراجعة وتقديم الطلبات", "تجديد تصاريح الإقامة"],
        en: ["Professional Visas (Talent Passport)", "Personal & Family Visas", "Application Review & Submission", "Residency Permit Renewals"]
      }
    },
    "corporate": {
      title: {
        fr: "Formalités d'Entreprise",
        ar: "إجراءات الشركات",
        en: "Company Formalities"
      },
      subtitle: {
        fr: "Gestion Administrative & Juridique",
        ar: "الإدارة الإدارية والقانونية",
        en: "Administrative & Legal Management"
      },
      description: {
        fr: "Nous gérons les aspects administratifs et juridiques du cycle de vie de votre entreprise. Que vous créiez une nouvelle entité, modifiiez les statuts ou procédiez à une dissolution, nous assurons une conformité totale.",
        ar: "ندير الجوانب الإدارية والقانونية لدورة حياة شركتك. سواء كنت تنشئ كياناً جديداً، أو تعدل القوانين الأساسية، أو تخضع للحل، فإننا نضمن الامتثال الكامل.",
        en: "We manage the administrative and legal aspects of your company lifecycle. Whether you are incorporating a new entity, modifying statutes, or undergoing dissolution, we ensure full compliance."
      },
      features: {
        fr: ["Création de Société (SAS, SARL...)", "Modification des Statuts", "Secrétariat Juridique", "Liquidation & Dissolution"],
        ar: ["تأسيس الشركات", "تعديل النظام الأساسي", "السكرتارية القانونية", "التصفية والحل"],
        en: ["Company Incorporation", "Statute Modification", "Legal Secretariat", "Liquidation & Dissolution"]
      }
    },
    "hr-training": {
      title: {
        fr: "Coaching & Formation",
        ar: "التدريب والتوجيه",
        en: "Coaching & Training"
      },
      subtitle: {
        fr: "Développer le Capital Humain",
        ar: "تطوير رأس المال البشري",
        en: "Developing Human Capital"
      },
      description: {
        fr: "Dédié au développement des ressources humaines. Nos programmes se concentrent sur l'amélioration des compétences, le coaching de leadership et l'atteinte des objectifs professionnels.",
        ar: "مخصص لتنمية الموارد البشرية للأفراد والشركات. تركز برامجنا على تعزيز المهارات، وتوجيه القيادة، وتحقيق الأهداف المهنية.",
        en: "Dedicated to human resources development. Our programs focus on skill enhancement, leadership coaching, and achieving professional goals."
      },
      features: {
        fr: ["Coaching Exécutif", "Ateliers de Leadership", "Soft Skills", "Développement de Carrière"],
        ar: ["التوجيه التنفيذي", "ورش عمل القيادة", "المهارات الشخصية", "التطوير الوظيفي"],
        en: ["Executive Coaching", "Team Leadership Workshops", "Soft Skills Training", "Career Development"]
      }
    },
    "compliance": {
      title: {
        fr: "Conformité & Risque",
        ar: "الامتثال والمخاطر",
        en: "Compliance & Risk"
      },
      subtitle: {
        fr: "Protéger Vos Actifs",
        ar: "حماية أصولك",
        en: "Protecting Your Assets"
      },
      description: {
        fr: "Dans un environnement réglementaire en constante évolution, la conformité n'est pas optionnelle. Nous vous aidons à construire des systèmes résilients qui résistent à l'examen.",
        ar: "في بيئة تنظيمية دائمة التغير، الامتثال ليس اختيارياً. نساعدك على بناء أنظمة مرنة تصمد أمام التدقيق وتحمي سمعتك.",
        en: "In an ever-changing regulatory environment, compliance is not optional. We help you build resilient systems that withstand scrutiny."
      },
      features: {
        fr: ["Conformité RGPD", "Lutte contre le Blanchiment (AML)", "Audits Internes", "Sécurité des Données"],
        ar: ["الامتثال للائحة حماية البيانات", "مكافحة غسيل الأموال", "التدقيق الداخلي", "أمن البيانات"],
        en: ["GDPR Compliance", "Anti-Money Laundering (AML)", "Internal Audits", "Data Security Protocols"]
      }
    },
    "digital": {
      title: {
        fr: "Transformation Digitale",
        ar: "التحول الرقمي",
        en: "Digital Transformation"
      },
      subtitle: {
        fr: "Pérennisez Votre Entreprise",
        ar: "مستقبل عملك",
        en: "Future-Proofing Your Business"
      },
      description: {
        fr: "Exploitez la puissance de l'IA et de la technologie moderne. Nous vous guidons à travers la transition numérique pour rester compétitif.",
        ar: "استفد من قوة الذكاء الاصطناعي والتكنولوجيا الحديثة. نوجهك خلال الانتقال الرقمي لضمان بقاء عملك قادراً على المنافسة.",
        en: "Leverage the power of AI and modern technology. We guide you through the digital transition to ensure your business stays competitive."
      },
      features: {
        fr: ["Stratégie IA", "Migration Cloud", "Automatisation des Processus", "Expérience Client Digitale"],
        ar: ["استراتيجية الذكاء الاصطناعي", "الانتقال السحابي", "أتمتة العمليات", "التجربة الرقمية للعملاء"],
        en: ["AI Integration Strategy", "Cloud Migration", "Process Automation", "Digital Customer Experience"]
      }
    },
    "real-estate": {
      title: {
        fr: "Droit Immobilier",
        ar: "القانون العقاري",
        en: "Real Estate Law"
      },
      subtitle: {
        fr: "Sécuriser Vos Transactions",
        ar: "تأمين معاملاتك",
        en: "Securing Your Transactions"
      },
      description: {
        fr: "Accompagnement juridique complet pour les transactions immobilières (achat/vente) et les projets de construction. Nous assurons que vos actifs sont protégés.",
        ar: "مرافقة قانونية شاملة للمعاملات العقارية (بيع/شراء) ومشاريع البناء. نضمن حماية أصولك وسير مشاريعك بسلاسة.",
        en: "Comprehensive legal accompaniment for real estate transactions (buying/selling) and construction projects. We ensure your assets are protected."
      },
      features: {
        fr: ["Support Acquisition", "Contrats de Construction", "Baux Commerciaux", "Contentieux Immobilier"],
        ar: ["دعم الاستحواذ", "عقود البناء", "عقود الإيجار", "النزاعات العقارية"],
        en: ["Property Acquisition Support", "Construction Contracts", "Lease Agreements", "Real Estate Litigation"]
      }
    }
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
