import { Locale } from '@/types';

export const translations = {
  ja: {
    nav: {
      home: 'ホーム',
      rooms: '客室一覧',
      about: '私たちについて',
      contact: 'お問い合わせ',
    },
    home: {
      title: '箱根仙石原寮',
      subtitle: '心温まる日本のおもてなし',
      search: {
        checkin: 'チェックイン',
        checkout: 'チェックアウト',
        guests: '人数',
        searchBtn: '検索',
      },
      featured: '人気の客室',
      introduction: {
        title: '日本の心、おもてなし',
        description: '箱根仙石原寮は、箱根の美しい自然に囲まれた宿泊施設です。完全予約制で、静かで落ち着いた環境の中で、心温まるひとときをお過ごしいただけます。'
      }
    },
    rooms: {
      title: '客室一覧',
      pricePerNight: '/泊',
      viewDetails: '詳細を見る',
      book: '予約する',
      sortBy: '並び替え',
      sortOptions: {
        priceLow: '料金: 安い順',
        priceHigh: '料金: 高い順',
        sizeLarge: '広さ: 広い順',
        guests: '定員: 多い順'
      },
      roomTypes: '部屋タイプ',
      roomTypeOptions: {
        corner: '角部屋',
        standard: 'スタンダード',
        connecting: '連結可能'
      },
      foundRooms: '室の客室が見つかりました',
      guestsCapacity: '名様まで対応',
      noResults: {
        title: '条件に合う客室が見つかりませんでした。',
        subtitle: '検索条件を変更してお試しください。'
      },
      loading: '読み込み中...'
    },
    roomDetail: {
      amenities: '設備・アメニティ',
      connectingRoom: '連結可能な部屋',
      connectingDescription: 'この部屋は隣の部屋と連結することができます。グループでのご利用に最適です。',
      viewConnectingRoom: '連結部屋を見る',
      roomNotFound: '部屋が見つかりません',
      selectDates: 'チェックイン・チェックアウト日を選択してください',
      maxGuestsExceeded: 'この部屋の最大定員は{max}名です'
    },
    booking: {
      title: '予約フォーム',
      guestName: 'お名前',
      guestEmail: 'メールアドレス',
      guestPhone: '電話番号',
      totalPrice: '合計金額',
      confirm: '予約確定',
      success: '予約が完了しました',
      processing: '処理中...',
      confirmationEmail: 'ご予約を承りました。予約番号は管理画面でご確認いただけます。',
      redirectMessage: '3秒後にトップページに戻ります。',
      bookingDetails: '予約内容',
      guestInfo: 'お客様情報',
      room: '客室',
      checkin: 'チェックイン',
      checkout: 'チェックアウト',
      nights: '宿泊日数',
      guests: '人数',
      cancellationPolicy: 'キャンセルポリシー',
      cancellationRules: [
        'チェックイン7日前まで：無料',
        'チェックイン3日前まで：50%',
        'チェックイン当日：100%'
      ],
      bookingNotFound: '予約情報が見つかりません',
      error: '予約の処理中にエラーが発生しました。もう一度お試しください。'
    },
    about: {
      title: '箱根仙石原寮について',
      description: [
        '箱根仙石原寮は、神奈川県箱根の美しい仙石原に位置する宿泊施設です。完全予約制で運営しており、静かで落ち着いた環境の中で、心温まるひとときをお過ごしいただけます。',
        '当施設では、6つの個性豊かな客室をご用意しております。東西の角部屋からは美しい朝日や夕日をご覧いただけ、中央の連結可能な部屋はグループでのご滞在に最適です。',
        'すべての客室には、快適にお過ごしいただくための設備を完備。エアコン、WiFi、冷蔵庫などの基本設備に加え、角部屋には電子レンジもご用意しております。'
      ],
      facilities: {
        title: '施設情報',
        items: [
          '全室エアコン完備',
          '無料WiFi',
          '料亭（自炊可）',
          '娯楽設備（ピアノ、カラオケ、囲碁、麻雀）',
          'ゴルフ練習場・コース',
          '完全予約制'
        ]
      },
      checkInOut: {
        title: 'チェックイン・アウト',
        checkin: 'チェックイン',
        checkout: 'チェックアウト',
        checkinTime: '15:00 〜 22:00',
        checkoutTime: '〜 11:00',
        note: '※ 22:00以降のチェックインは事前にご連絡ください'
      },
      access: {
        title: 'アクセス',
        address: '〒250-0631 神奈川県足柄下郡箱根町仙石原 1236',
        station: '箱根仙石原エリア',
        note: '※ 詳細なアクセス方法は、ご予約確定後にお送りする確認メールに記載いたします。'
      }
    },
    contact: {
      title: 'お問い合わせフォーム',
      name: 'お名前',
      email: 'メールアドレス',
      message: 'お問い合わせ内容',
      send: '送信する',
      sending: '送信中...',
      success: 'お問い合わせを受け付けました。ありがとうございます。',
      phone: {
        title: 'お電話でのお問い合わせ',
        number: '(0460) 83-9465',
        mobile: '(090) 3215-3202',
        hours: '完全予約制',
        contact: '担当者：山田',
        note: '※ 完全予約制のため、事前にお電話でご予約ください'
      },
      emailContact: {
        title: 'メールでのお問い合わせ',
        address: 'asuka.hotel@seiku.co.jp',
        note: '※ 24時間以内にご返信いたします'
      },
      location: {
        title: '所在地',
        address: '〒250-0631',
        city: '神奈川県足柄下郡箱根町仙石原 1236',
        station: '箱根仙石原エリア'
      },
      faq: {
        title: 'よくあるご質問',
        items: [
          {
            q: 'キャンセル料はいつから発生しますか？',
            a: 'チェックイン7日前から発生いたします。'
          },
          {
            q: '駐車場はありますか？',
            a: '申し訳ございませんが、専用駐車場はございません。'
          },
          {
            q: 'チェックイン時間を過ぎる場合は？',
            a: '事前にお電話でご連絡ください。'
          }
        ]
      }
    },
    auth: {
      login: {
        title: '会員ログイン',
        subtitle: 'ようこそ戻りました、ログインしてください',
        email: 'メールアドレス',
        password: 'パスワード',
        loginBtn: 'ログイン',
        loginProgress: 'ログイン中...',
        noAccount: 'アカウントをお持ちではないですか？',
        register: '今すぐ登録',
        adminLogin: 'スタッフログイン入口'
      },
      register: {
        title: '会員登録',
        subtitle: 'アカウントを作成してより便利な予約体験をお楽しみください',
        name: '名前',
        email: 'メールアドレス',
        password: 'パスワード',
        confirmPassword: 'パスワード確認',
        registerBtn: '登録',
        registerProgress: '登録中...',
        hasAccount: 'すでにアカウントをお持ちですか？',
        login: '今すぐログイン'
      },
      errors: {
        fillAllFields: 'すべてのフィールドを入力してください',
        passwordMismatch: '入力されたパスワードが一致しません',
        passwordTooShort: 'パスワードは6文字以上である必要があります',
        emailInvalid: '有効なメールアドレスを入力してください',
        networkError: 'ネットワークエラーが発生しました。もう一度お試しください'
      }
    },
    common: {
      yen: '円',
      night: '泊',
      person: '名',
      back: '戻る',
      required: '必須',
      optional: '任意',
      copyright: '© 2024 箱根仙石原寮. All rights reserved.',
      more: 'もっと見る',
      connecting: '連結可能'
    },
  },
  en: {
    nav: {
      home: 'Home',
      rooms: 'Rooms',
      about: 'About Us',
      contact: 'Contact',
    },
    home: {
      title: 'Asuka Hotel',
      subtitle: 'Heartwarming Japanese Hospitality',
      search: {
        checkin: 'Check-in',
        checkout: 'Check-out',
        guests: 'Guests',
        searchBtn: 'Search',
      },
      featured: 'Featured Rooms',
      introduction: {
        title: 'Japanese Heart of Hospitality',
        description: 'Asuka Hotel is a traditional Japanese lodge located in the beautiful Sengokuhara area of Hakone. Operating by reservation only, enjoy a heartwarming stay in a quiet and peaceful environment.'
      }
    },
    rooms: {
      title: 'Our Rooms',
      pricePerNight: '/night',
      viewDetails: 'View Details',
      book: 'Book Now',
      sortBy: 'Sort by',
      sortOptions: {
        priceLow: 'Price: Low to High',
        priceHigh: 'Price: High to Low',
        sizeLarge: 'Size: Largest First',
        guests: 'Capacity: Most Guests'
      },
      roomTypes: 'Room Types',
      roomTypeOptions: {
        corner: 'Corner Room',
        standard: 'Standard',
        connecting: 'Connecting'
      },
      foundRooms: ' rooms found',
      guestsCapacity: ' guests maximum',
      noResults: {
        title: 'No rooms found matching your criteria.',
        subtitle: 'Please modify your search criteria and try again.'
      },
      loading: 'Loading...'
    },
    roomDetail: {
      amenities: 'Amenities',
      connectingRoom: 'Connecting Room',
      connectingDescription: 'This room can be connected to the adjacent room. Perfect for group stays.',
      viewConnectingRoom: 'View Connecting Room',
      roomNotFound: 'Room not found',
      selectDates: 'Please select check-in and check-out dates',
      maxGuestsExceeded: 'Maximum capacity for this room is {max} guests'
    },
    booking: {
      title: 'Booking Form',
      guestName: 'Full Name',
      guestEmail: 'Email Address',
      guestPhone: 'Phone Number',
      totalPrice: 'Total Price',
      confirm: 'Confirm Booking',
      success: 'Booking completed successfully',
      processing: 'Processing...',
      confirmationEmail: 'Your reservation has been confirmed. You can check your booking number in the admin panel.',
      redirectMessage: 'Redirecting to homepage in 3 seconds.',
      bookingDetails: 'Booking Details',
      guestInfo: 'Guest Information',
      room: 'Room',
      checkin: 'Check-in',
      checkout: 'Check-out',
      nights: 'Nights',
      guests: 'Guests',
      cancellationPolicy: 'Cancellation Policy',
      cancellationRules: [
        'Up to 7 days before check-in: Free',
        'Up to 3 days before check-in: 50%',
        'Day of check-in: 100%'
      ],
      bookingNotFound: 'Booking information not found',
      error: 'An error occurred while processing your booking. Please try again.'
    },
    about: {
      title: 'About Asuka Hotel',
      description: [
        'Asuka Hotel is a traditional Japanese lodge located in the beautiful Sengokuhara area of Hakone, Kanagawa Prefecture. Operating by reservation only, we provide a quiet and peaceful environment for a heartwarming stay.',
        'We offer 6 unique rooms. The east and west corner rooms provide beautiful views of the sunrise and sunset, while the central connecting rooms are perfect for group stays.',
        'All rooms are equipped with comfortable amenities. In addition to basic facilities like air conditioning, WiFi, and refrigerator, corner rooms also feature microwaves.'
      ],
      facilities: {
        title: 'Facilities',
        items: [
          'Air conditioning in all rooms',
          'Free WiFi',
          'Traditional restaurant (self-catering available)',
          'Entertainment facilities (Piano, Karaoke, Go, Mahjong)',
          'Golf practice range and course',
          'Reservation only'
        ]
      },
      checkInOut: {
        title: 'Check-in / Check-out',
        checkin: 'Check-in',
        checkout: 'Check-out',
        checkinTime: '3:00 PM - 10:00 PM',
        checkoutTime: 'Until 11:00 AM',
        note: '* Please contact us in advance for check-in after 10:00 PM'
      },
      access: {
        title: 'Access',
        address: '〒250-0631 1236 Sengokuhara, Hakone-machi, Ashigarashimo-gun, Kanagawa',
        station: 'Hakone Sengokuhara Area',
        note: '* Detailed access information will be provided in the confirmation email after booking.'
      }
    },
    contact: {
      title: 'Contact Form',
      name: 'Name',
      email: 'Email Address',
      message: 'Message',
      send: 'Send',
      sending: 'Sending...',
      success: 'Your inquiry has been received. Thank you.',
      phone: {
        title: 'Phone Inquiries',
        number: '(0460) 83-9465',
        mobile: '(090) 3215-3202',
        hours: 'Reservation Only',
        contact: 'Contact: Mr. Yamada',
        note: '* Reservation required in advance'
      },
      emailContact: {
        title: 'Email Inquiries',
        address: 'asuka.hotel@seiku.co.jp',
        note: '* We will respond within 24 hours'
      },
      location: {
        title: 'Location',
        address: '〒250-0631',
        city: '1236 Sengokuhara, Hakone-machi, Ashigarashimo-gun, Kanagawa',
        station: 'Hakone Sengokuhara Area'
      },
      faq: {
        title: 'Frequently Asked Questions',
        items: [
          {
            q: 'When do cancellation fees apply?',
            a: 'Cancellation fees apply from 7 days before check-in.'
          },
          {
            q: 'Is parking available?',
            a: 'Sorry, we do not have dedicated parking.'
          },
          {
            q: 'What if I arrive after check-in time?',
            a: 'Please contact us by phone in advance.'
          }
        ]
      }
    },
    auth: {
      login: {
        title: 'Member Login',
        subtitle: 'Welcome back, please sign in to your account',
        email: 'Email Address',
        password: 'Password',
        loginBtn: 'Login',
        loginProgress: 'Logging in...',
        noAccount: "Don't have an account?",
        register: 'Sign up now',
        adminLogin: 'Staff Login'
      },
      register: {
        title: 'Member Registration',
        subtitle: 'Create your account for a more convenient booking experience',
        name: 'Full Name',
        email: 'Email Address',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        registerBtn: 'Register',
        registerProgress: 'Registering...',
        hasAccount: 'Already have an account?',
        login: 'Sign in now'
      },
      errors: {
        fillAllFields: 'Please fill in all fields',
        passwordMismatch: 'Passwords do not match',
        passwordTooShort: 'Password must be at least 6 characters',
        emailInvalid: 'Please enter a valid email address',
        networkError: 'Network error occurred. Please try again'
      }
    },
    common: {
      yen: 'JPY',
      night: 'night',
      person: 'guest',
      back: 'Back',
      required: 'required',
      optional: 'optional',
      copyright: '© 2024 Asuka Hotel. All rights reserved.',
      more: 'More',
      connecting: 'Connecting'
    },
  },
  zh: {
    nav: {
      home: '首页',
      rooms: '客房',
      about: '关于我们',
      contact: '联系我们',
    },
    home: {
      title: '箱根仙石原寮',
      subtitle: '温馨的日式待客之道',
      search: {
        checkin: '入住日期',
        checkout: '退房日期',
        guests: '人数',
        searchBtn: '搜索',
      },
      featured: '推荐客房',
      introduction: {
        title: '日本式的待客之心',
        description: '箱根仙石原寮位于神奈川县箱根美丽的仙石原地区。采用完全预约制，在宁静祥和的环境中，享受温暖人心的美好时光。'
      }
    },
    rooms: {
      title: '客房列表',
      pricePerNight: '/晚',
      viewDetails: '查看详情',
      book: '立即预订',
      sortBy: '排序方式',
      sortOptions: {
        priceLow: '价格：低到高',
        priceHigh: '价格：高到低',
        sizeLarge: '面积：大到小',
        guests: '入住人数：多到少'
      },
      roomTypes: '房间类型',
      roomTypeOptions: {
        corner: '角房',
        standard: '标准间',
        connecting: '连通房'
      },
      foundRooms: '间客房符合条件',
      guestsCapacity: '人以内',
      noResults: {
        title: '没有找到符合条件的客房。',
        subtitle: '请修改搜索条件后重试。'
      },
      loading: '加载中...'
    },
    roomDetail: {
      amenities: '设施与用品',
      connectingRoom: '连通房间',
      connectingDescription: '此房间可与相邻房间连通，非常适合团体入住。',
      viewConnectingRoom: '查看连通房间',
      roomNotFound: '未找到房间',
      selectDates: '请选择入住和退房日期',
      maxGuestsExceeded: '此房间最多可入住{max}人'
    },
    booking: {
      title: '预订表单',
      guestName: '姓名',
      guestEmail: '邮箱地址',
      guestPhone: '电话号码',
      totalPrice: '总价格',
      confirm: '确认预订',
      success: '预订成功完成',
      processing: '处理中...',
      confirmationEmail: '您的预订已确认。可在管理面板中查看预订编号。',
      redirectMessage: '3秒后返回首页。',
      bookingDetails: '预订详情',
      guestInfo: '客人信息',
      room: '客房',
      checkin: '入住',
      checkout: '退房',
      nights: '住宿天数',
      guests: '人数',
      cancellationPolicy: '取消政策',
      cancellationRules: [
        '入住前7天以上：免费',
        '入住前3天以上：50%',
        '入住当日：100%'
      ],
      bookingNotFound: '未找到预订信息',
      error: '处理预订时发生错误，请重试。'
    },
    about: {
      title: '关于箱根仙石原寮',
      description: [
        '箱根仙石原寮位于神奈川县箱根美丽的仙石原地区。采用完全预约制经营，在宁静祥和的环境中，享受温暖人心的美好时光。',
        '我们提供6间各具特色的客房。东西两侧的角房可欣赏美丽的日出日落，中央的连通房非常适合团体入住。',
        '所有客房均配备舒适的设施。除了空调、WiFi、冰箱等基本设施外，角房还配有微波炉。'
      ],
      facilities: {
        title: '设施信息',
        items: [
          '全房间空调',
          '免费WiFi',
          '料亭（可自炊）',
          '娱乐设施（钢琴、卡拉OK、围棋、麻将）',
          '高尔夫练习场及球场',
          '完全预约制'
        ]
      },
      checkInOut: {
        title: '入住/退房',
        checkin: '入住',
        checkout: '退房',
        checkinTime: '下午3:00 - 晚上10:00',
        checkoutTime: '上午11:00之前',
        note: '* 晚上10:00后入住请提前联系'
      },
      access: {
        title: '交通信息',
        address: '〒250-0631 神奈川县足柄下郡箱根町仙石原 1236',
        station: '箱根仙石原地区',
        note: '* 详细交通信息将在预订确认后的邮件中提供。'
      }
    },
    contact: {
      title: '联系表单',
      name: '姓名',
      email: '邮箱地址',
      message: '咨询内容',
      send: '发送',
      sending: '发送中...',
      success: '您的咨询已收到，谢谢。',
      phone: {
        title: '电话咨询',
        number: '(0460) 83-9465',
        mobile: '(090) 3215-3202',
        hours: '完全预约制',
        contact: '联系人：山田',
        note: '* 采用完全预约制，请提前电话预约'
      },
      emailContact: {
        title: '邮件咨询',
        address: 'asuka.hotel@seiku.co.jp',
        note: '* 我们将在24小时内回复'
      },
      location: {
        title: '地址',
        address: '〒250-0631',
        city: '神奈川县足柄下郡箱根町仙石原 1236',
        station: '箱根仙石原地区'
      },
      faq: {
        title: '常见问题',
        items: [
          {
            q: '取消费用何时开始收取？',
            a: '入住前7天开始收取取消费用。'
          },
          {
            q: '有停车场吗？',
            a: '很抱歉，我们没有专用停车场。'
          },
          {
            q: '如果超过入住时间怎么办？',
            a: '请提前电话联系我们。'
          }
        ]
      }
    },
    auth: {
      login: {
        title: '会员登录',
        subtitle: '欢迎回来，请登录您的账户',
        email: '邮箱地址',
        password: '密码',
        loginBtn: '登录',
        loginProgress: '登录中...',
        noAccount: '还没有账户？',
        register: '立即注册',
        adminLogin: '员工登录入口'
      },
      register: {
        title: '会员注册',
        subtitle: '创建您的账户以享受更便捷的预订体验',
        name: '姓名',
        email: '邮箱地址',
        password: '密码',
        confirmPassword: '确认密码',
        registerBtn: '注册',
        registerProgress: '注册中...',
        hasAccount: '已有账户？',
        login: '立即登录'
      },
      errors: {
        fillAllFields: '请填写所有字段',
        passwordMismatch: '两次输入的密码不一致',
        passwordTooShort: '密码长度至少为6位',
        emailInvalid: '请输入有效的邮箱地址',
        networkError: '网络错误，请重试'
      }
    },
    common: {
      yen: '日元',
      night: '晚',
      person: '人',
      back: '返回',
      required: '必填',
      optional: '选填',
      copyright: '© 2024 箱根仙石原寮. 版权所有.',
      more: '更多',
      connecting: '连通房'
    },
  },
};

export function getTranslation(locale: Locale) {
  return translations[locale] || translations.ja;
}