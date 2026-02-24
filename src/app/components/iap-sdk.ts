// ─── In-App Purchase SDK Mock ───
// Simulates App Store / Google Play IAP for development.
// Production replacement:
//   - iOS: StoreKit 2
//   - Android: Google Play Billing Library v6+
//   - Cross-platform: react-native-iap / Unity IAP
//   - Server: Receipt validation via Apple/Google server APIs

export type IAPProductType = "consumable" | "non_consumable" | "subscription";

export interface IAPProduct {
  id: string;
  title: string;
  description: string;
  price: string;        // Localized price string (e.g. "₩1,000")
  priceAmount: number;  // Numeric amount in local currency
  currency: string;
  type: IAPProductType;
  iconEmoji?: string;   // For UI display
}

export interface IAPPurchaseResult {
  success: boolean;
  productId: string;
  transactionId?: string;
  receipt?: string;
  error?: string;
  errorCode?: IAPErrorCode;
}

export type IAPErrorCode =
  | "USER_CANCELLED"
  | "NETWORK_ERROR"
  | "PRODUCT_NOT_FOUND"
  | "ALREADY_OWNED"
  | "PAYMENT_FAILED"
  | "VERIFICATION_FAILED"
  | "PENDING"
  | "DEFERRED"
  | "UNKNOWN";

export interface IAPRestoreResult {
  success: boolean;
  restoredProducts: string[];
  error?: string;
}

export interface PendingTransaction {
  transactionId: string;
  productId: string;
  status: "pending" | "verified" | "failed";
  timestamp: number;
  receipt: string;
}

// ─── Product Catalog ───
export const IAP_PRODUCTS: IAPProduct[] = [
  // Premium currency (consumable)
  {
    id: "com.catblockpop.premium_1000",
    title: "하얀 발바닥 1,000",
    description: "하얀 발바닥 1,000개를 구매합니다.",
    price: "₩1,100",
    priceAmount: 1100,
    currency: "KRW",
    type: "consumable",
    iconEmoji: "🐾",
  },
  {
    id: "com.catblockpop.premium_5000",
    title: "하얀 발바닥 5,000",
    description: "하얀 발바닥 5,000개를 구매합니다.",
    price: "₩5,500",
    priceAmount: 5500,
    currency: "KRW",
    type: "consumable",
    iconEmoji: "🐾",
  },
  {
    id: "com.catblockpop.premium_10000",
    title: "하얀 발바닥 11,000",
    description: "하얀 발바닥 11,000개를 구매합니다. (10% 보너스!)",
    price: "₩11,000",
    priceAmount: 11000,
    currency: "KRW",
    type: "consumable",
    iconEmoji: "🐾",
  },
  {
    id: "com.catblockpop.premium_30000",
    title: "하얀 발바닥 33,000",
    description: "하얀 발바닥 33,000개를 구매합니다. (10% 보너스!)",
    price: "₩33,000",
    priceAmount: 33000,
    currency: "KRW",
    type: "consumable",
    iconEmoji: "🐾",
  },
  // Ad removal (non-consumable)
  {
    id: "com.catblockpop.no_ads",
    title: "광고 제거",
    description: "모든 배너/전면 광고를 영구적으로 제거합니다.",
    price: "₩3,300",
    priceAmount: 3300,
    currency: "KRW",
    type: "non_consumable",
    iconEmoji: "🚫",
  },
  // Starter pack (consumable)
  {
    id: "com.catblockpop.starter_pack",
    title: "스타터 팩",
    description: "츄르 5개 + 고양이풀 3개 + 꾹꾹이 2개 + 하얀 발바닥 5,000",
    price: "₩6,600",
    priceAmount: 6600,
    currency: "KRW",
    type: "consumable",
    iconEmoji: "🎁",
  },
];

// ─── IAP State ───
let _initialized = false;
let _availableProducts: IAPProduct[] = [];
let _pendingTransactions: PendingTransaction[] = [];
let _purchaseInProgress = false;

// ─── Initialize IAP ───
export function initIAP(): Promise<boolean> {
  return new Promise(resolve => {
    if (_initialized) {
      resolve(true);
      return;
    }

    console.log("[IAP] Initializing...");
    setTimeout(() => {
      _initialized = true;
      _availableProducts = [...IAP_PRODUCTS];

      // Restore any pending transactions
      try {
        const pending = localStorage.getItem("catblockpop_pending_txns");
        if (pending) {
          _pendingTransactions = JSON.parse(pending);
          if (_pendingTransactions.length > 0) {
            console.log("[IAP] Found", _pendingTransactions.length, "pending transactions");
          }
        }
      } catch {}

      console.log("[IAP] Initialized, products:", _availableProducts.length);
      resolve(true);
    }, 500);
  });
}

// ─── Fetch Available Products ───
export function getProducts(): IAPProduct[] {
  return _availableProducts;
}

export function getProductById(productId: string): IAPProduct | undefined {
  return _availableProducts.find(p => p.id === productId);
}

// ─── Purchase Flow ───
export function purchaseProduct(productId: string): Promise<IAPPurchaseResult> {
  return new Promise(resolve => {
    if (!_initialized) {
      resolve({ success: false, productId, error: "IAP not initialized", errorCode: "UNKNOWN" });
      return;
    }

    if (_purchaseInProgress) {
      resolve({ success: false, productId, error: "Another purchase is in progress", errorCode: "UNKNOWN" });
      return;
    }

    const product = _availableProducts.find(p => p.id === productId);
    if (!product) {
      resolve({ success: false, productId, error: "Product not found", errorCode: "PRODUCT_NOT_FOUND" });
      return;
    }

    // Check non-consumable already owned
    if (product.type === "non_consumable") {
      try {
        const owned = localStorage.getItem(`catblockpop_owned_${productId}`);
        if (owned === "true") {
          resolve({ success: false, productId, error: "Already owned", errorCode: "ALREADY_OWNED" });
          return;
        }
      } catch {}
    }

    _purchaseInProgress = true;
    console.log(`[IAP] Purchase flow: ${product.title} (${product.price})`);
    console.log(`[IAP] Showing payment sheet...`);

    // Simulate payment processing
    setTimeout(() => {
      // 90% success rate in mock
      const roll = Math.random();
      if (roll < 0.90) {
        const txId = `txn_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        const receipt = btoa(JSON.stringify({
          productId,
          transactionId: txId,
          purchaseDate: new Date().toISOString(),
          environment: "sandbox",
          quantity: 1,
          appStoreReceipt: `mock_receipt_${txId}`,
        }));

        // Track pending transaction
        const pendingTx: PendingTransaction = {
          transactionId: txId,
          productId,
          status: "pending",
          timestamp: Date.now(),
          receipt,
        };
        _pendingTransactions.push(pendingTx);
        savePendingTransactions();

        // Mark non-consumable as owned
        if (product.type === "non_consumable") {
          try { localStorage.setItem(`catblockpop_owned_${productId}`, "true"); } catch {}
        }

        console.log(`[IAP] Purchase successful! TxID: ${txId}`);
        _purchaseInProgress = false;

        resolve({
          success: true,
          productId,
          transactionId: txId,
          receipt,
        });
      } else if (roll < 0.95) {
        // User cancelled
        console.log("[IAP] User cancelled purchase");
        _purchaseInProgress = false;
        resolve({
          success: false,
          productId,
          error: "User cancelled",
          errorCode: "USER_CANCELLED",
        });
      } else {
        // Payment failed
        console.log("[IAP] Payment failed (simulated)");
        _purchaseInProgress = false;
        resolve({
          success: false,
          productId,
          error: "결제 처리 중 오류가 발생했습니다",
          errorCode: "PAYMENT_FAILED",
        });
      }
    }, 2000);
  });
}

// ─── Server-side Receipt Verification ───
export function verifyReceipt(receipt: string): Promise<boolean> {
  return new Promise(resolve => {
    console.log("[IAP] Verifying receipt with server...");
    // In production:
    //   - POST receipt to YOUR backend server
    //   - Backend calls Apple's verifyReceipt or Google Play Developer API
    //   - Backend validates receipt, checks for fraud
    //   - Backend grants items to user account
    //   - Never trust client-side receipt validation alone!
    setTimeout(() => {
      try {
        const decoded = JSON.parse(atob(receipt));
        const txId = decoded.transactionId;

        // Mark transaction as verified
        const pendingTx = _pendingTransactions.find(t => t.transactionId === txId);
        if (pendingTx) {
          pendingTx.status = "verified";
          savePendingTransactions();
        }

        console.log("[IAP] Receipt verified:", txId);
        resolve(true);
      } catch {
        console.error("[IAP] Receipt verification failed");
        resolve(false);
      }
    }, 800);
  });
}

// ─── Finish/Consume Transaction ───
// IMPORTANT: Must be called after granting items to the user.
// On iOS (StoreKit 2): finishTransaction()
// On Android: acknowledgePurchase() / consumeAsync()
export function finishTransaction(transactionId: string): Promise<boolean> {
  return new Promise(resolve => {
    console.log(`[IAP] Finishing transaction: ${transactionId}`);

    // Remove from pending
    _pendingTransactions = _pendingTransactions.filter(t => t.transactionId !== transactionId);
    savePendingTransactions();

    console.log("[IAP] Transaction finished");
    resolve(true);
  });
}

// ─── Restore Purchases (non-consumable) ───
export function restorePurchases(): Promise<IAPRestoreResult> {
  return new Promise(resolve => {
    console.log("[IAP] Restoring purchases...");
    setTimeout(() => {
      const restored: string[] = [];
      try {
        // Check all non-consumable products
        for (const product of _availableProducts) {
          if (product.type === "non_consumable") {
            const owned = localStorage.getItem(`catblockpop_owned_${product.id}`);
            if (owned === "true") {
              restored.push(product.id);
            }
          }
        }
        // Also check legacy key
        if (localStorage.getItem("catblockpop_adremoved") === "true") {
          if (!restored.includes("com.catblockpop.no_ads")) {
            restored.push("com.catblockpop.no_ads");
          }
        }
      } catch {}
      console.log("[IAP] Restored:", restored);
      resolve({ success: true, restoredProducts: restored });
    }, 1000);
  });
}

// ─── Get Pending Transactions ───
export function getPendingTransactions(): PendingTransaction[] {
  return [..._pendingTransactions];
}

// ─── Process Pending Transactions ───
// Call this on app startup to re-verify/complete any pending purchases
export async function processPendingTransactions(
  onGrantItems: (productId: string, txId: string) => void,
): Promise<number> {
  const pending = _pendingTransactions.filter(t => t.status === "pending");
  let processed = 0;

  for (const tx of pending) {
    try {
      const verified = await verifyReceipt(tx.receipt);
      if (verified) {
        onGrantItems(tx.productId, tx.transactionId);
        await finishTransaction(tx.transactionId);
        processed++;
      } else {
        tx.status = "failed";
      }
    } catch {
      console.error("[IAP] Failed to process pending tx:", tx.transactionId);
    }
  }

  savePendingTransactions();
  return processed;
}

// ─── Consume a Consumable Purchase ───
export function consumePurchase(transactionId: string): Promise<boolean> {
  console.log(`[IAP] Consuming purchase: ${transactionId}`);
  return finishTransaction(transactionId);
}

// ─── Product ID Helpers ───
export function getPremiumAmountForProduct(productId: string): number {
  switch (productId) {
    case "com.catblockpop.premium_1000": return 1000;
    case "com.catblockpop.premium_5000": return 5000;
    case "com.catblockpop.premium_10000": return 11000; // 10% bonus
    case "com.catblockpop.premium_30000": return 33000; // 10% bonus
    case "com.catblockpop.starter_pack": return 5000;
    default: return 0;
  }
}

export function getStarterPackItems(): { churu: number; catnip: number; knead: number; premium: number } {
  return { churu: 5, catnip: 3, knead: 2, premium: 5000 };
}

// ─── Internal Helpers ───
function savePendingTransactions() {
  try {
    localStorage.setItem("catblockpop_pending_txns", JSON.stringify(_pendingTransactions));
  } catch {}
}

// ─── Subscription Check (future use) ───
export function checkSubscriptionStatus(_productId: string): Promise<{ active: boolean; expiresAt?: string }> {
  // In production: Check with backend/store for subscription validity
  return Promise.resolve({ active: false });
}
