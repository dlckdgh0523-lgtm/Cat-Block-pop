import React, { useState, useEffect } from "react";
import { ITEM_DEFS, type ItemKey, type ItemInventory } from "./game-logic";
import { BlackPaw, WhitePaw, ChuruIcon, CatnipIcon, KneadIcon } from "./paw-icons";
import { BLOCK_SKINS, PREMIUM_PACKAGES, type PlayerProgress, type BlockSkin, getBoardTheme } from "./skins-data";
import { playPurchase, playHiss } from "./sound-effects";
import { CatCell } from "./cat-cell";
import { purchaseProduct, verifyReceipt, restorePurchases, initIAP, type IAPPurchaseResult } from "./iap-sdk";

interface CatShopProps {
  blackPaw: number;
  whitePaw: number;
  items: ItemInventory;
  progress: PlayerProgress;
  onBuy: (itemKey: ItemKey) => boolean;
  onBuyPremium: (amount: number) => void;
  onBuySkin: (skinId: BlockSkin) => boolean;
  onExchangeCurrency: (whiteAmount: number) => void;
  onBuyAdRemoval: () => void;
  adRemoved: boolean;
  onClose: () => void;
  onAddItems?: (churu: number, catnip: number, knead: number) => void;
}

function getItemIcon(key: ItemKey, size: number) {
  switch (key) {
    case "churu": return <ChuruIcon size={size} />;
    case "catnip": return <CatnipIcon size={size} />;
    case "knead": return <KneadIcon size={size} />;
  }
}

// ─── IAP Purchase Modal ───
type PurchaseState = "idle" | "processing" | "verifying" | "success" | "error";

function IAPModal({ state, productName, price, error, onClose, accent, gradient }: {
  state: PurchaseState;
  productName: string;
  price: string;
  error?: string;
  onClose: () => void;
  accent: string;
  gradient: string;
}) {
  if (state === "idle") return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.6)" }}>
      <div className="w-full max-w-[300px] rounded-2xl p-5 text-center"
        style={{ background: "rgba(255,255,255,0.97)", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
        {state === "processing" && (
          <>
            <div className="text-3xl mb-3" style={{ animation: "iapSpin 1s linear infinite" }}>
              💳
            </div>
            <p className="text-sm mb-1" style={{ color: accent }}>결제 처리 중...</p>
            <p className="text-xs" style={{ color: "#C3A0B1" }}>{productName}</p>
            <p className="text-xs mt-1" style={{ color: "#B8A080" }}>{price}</p>
            <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(232,115,154,0.15)" }}>
              <div className="h-full rounded-full" style={{
                background: gradient,
                animation: "iapProgress 2s ease-in-out infinite",
              }} />
            </div>
          </>
        )}
        {state === "verifying" && (
          <>
            <div className="text-3xl mb-3" style={{ animation: "iapSpin 0.8s linear infinite" }}>
              🔍
            </div>
            <p className="text-sm mb-1" style={{ color: accent }}>영수증 검증 중...</p>
            <p className="text-[10px]" style={{ color: "#C3A0B1" }}>서버와 통신 중입니다</p>
          </>
        )}
        {state === "success" && (
          <>
            <div className="text-4xl mb-3" style={{ animation: "iapBounce 0.5s ease" }}>
              ✅
            </div>
            <p className="text-sm mb-1" style={{ color: "#4CAF50" }}>결제 완료!</p>
            <p className="text-xs mb-3" style={{ color: "#A0889A" }}>{productName}</p>
            <button onClick={onClose}
              className="w-full py-2.5 rounded-xl text-white text-sm cursor-pointer transition-all active:scale-95"
              style={{ background: gradient }}>
              확인
            </button>
          </>
        )}
        {state === "error" && (
          <>
            <div className="text-3xl mb-3">❌</div>
            <p className="text-sm mb-1" style={{ color: "#E55A5A" }}>결제 실패</p>
            <p className="text-xs mb-3" style={{ color: "#A0889A" }}>{error || "알 수 없는 오류가 발생했습니다"}</p>
            <button onClick={onClose}
              className="w-full py-2.5 rounded-xl text-white text-sm cursor-pointer transition-all active:scale-95"
              style={{ background: "rgba(200,180,190,0.6)" }}>
              닫기
            </button>
          </>
        )}
      </div>
      <style>{`
        @keyframes iapSpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes iapProgress { 0% { width: 0; } 50% { width: 80%; } 100% { width: 100%; } }
        @keyframes iapBounce { 0% { transform: scale(0); } 60% { transform: scale(1.2); } 100% { transform: scale(1); } }
      `}</style>
    </div>
  );
}

export function CatShop({ blackPaw, whitePaw, items, progress, onBuy, onBuyPremium, onBuySkin, onExchangeCurrency, onBuyAdRemoval, adRemoved, onClose, onAddItems }: CatShopProps) {
  const [tab, setTab] = useState<"items" | "skins" | "premium">("items");
  const [selectedItem, setSelectedItem] = useState<ItemKey | null>(null);
  const [buyAnim, setBuyAnim] = useState<string | null>(null);
  const [iapState, setIapState] = useState<PurchaseState>("idle");
  const [iapProductName, setIapProductName] = useState("");
  const [iapPrice, setIapPrice] = useState("");
  const [iapError, setIapError] = useState("");
  const [restoring, setRestoring] = useState(false);
  const bt = getBoardTheme(progress.equippedSkin);

  // Init IAP on mount
  useEffect(() => { initIAP(); }, []);

  const handleBuy = (key: ItemKey) => {
    if (onBuy(key)) {
      playPurchase();
      setBuyAnim(key);
      setTimeout(() => setBuyAnim(null), 600);
    } else playHiss();
  };

  const handleBuySkin = (skinId: BlockSkin) => {
    if (onBuySkin(skinId)) {
      playPurchase();
      setBuyAnim(skinId);
      setTimeout(() => setBuyAnim(null), 600);
    } else playHiss();
  };

  // ─── IAP Purchase Flow ───
  const handleIAPPurchase = async (productId: string, name: string, price: string, onSuccess: () => void) => {
    setIapProductName(name);
    setIapPrice(price);
    setIapState("processing");
    setIapError("");

    try {
      const result: IAPPurchaseResult = await purchaseProduct(productId);
      if (!result.success) {
        if (result.errorCode === "USER_CANCELLED") {
          setIapState("idle");
          return;
        }
        setIapError(result.error || "결제에 실패했습니다");
        setIapState("error");
        return;
      }

      // Verify receipt
      setIapState("verifying");
      if (result.receipt) {
        const verified = await verifyReceipt(result.receipt);
        if (!verified) {
          setIapError("영수증 검증에 실패했습니다. 고객센터에 문의해주세요.");
          setIapState("error");
          return;
        }
      }

      // Success!
      onSuccess();
      playPurchase();
      setIapState("success");
    } catch {
      setIapError("네트워크 오류가 발생했습니다");
      setIapState("error");
    }
  };

  const handlePremiumPurchase = (pkg: typeof PREMIUM_PACKAGES[0]) => {
    handleIAPPurchase(
      pkg.id,
      `${pkg.amount.toLocaleString()} 프리미엄 포인트`,
      pkg.price,
      () => onBuyPremium(pkg.amount),
    );
  };

  const handleAdRemovalPurchase = () => {
    handleIAPPurchase(
      "com.catblockpop.no_ads",
      "광고 제거 (No Ads)",
      "₩3,000",
      () => onBuyAdRemoval(),
    );
  };

  const handleStarterPackPurchase = () => {
    handleIAPPurchase(
      "com.catblockpop.starter_pack",
      "스타터 팩",
      "₩6,500",
      () => {
        onBuyPremium(5000);
        onAddItems?.(5, 3, 2);
      },
    );
  };

  const handleRestore = async () => {
    setRestoring(true);
    try {
      const result = await restorePurchases();
      if (result.success && result.restoredProducts.length > 0) {
        if (result.restoredProducts.includes("com.catblockpop.no_ads")) {
          onBuyAdRemoval();
        }
        alert(`${result.restoredProducts.length}개의 구매가 복원되었습니다.`);
      } else {
        alert("복원할 구매 내역이 없습니다.");
      }
    } catch {
      alert("복원 중 오류가 발생했습니다.");
    }
    setRestoring(false);
  };

  const itemKeys: ItemKey[] = ["churu", "catnip", "knead"];

  return (
    <div className="flex flex-col items-center min-h-screen p-4 pb-8"
      style={{ fontFamily: "'Nunito', sans-serif" }}>

      <IAPModal state={iapState} productName={iapProductName} price={iapPrice}
        error={iapError} onClose={() => setIapState("idle")}
        accent={bt.accent} gradient={bt.comboBadge} />

      {/* Header */}
      <div className="w-full max-w-[400px] flex items-center justify-between mb-3 mt-2">
        <button onClick={onClose}
          className="w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer transition-all active:scale-90"
          style={{ background: "rgba(255,255,255,0.5)", color: bt.accent }}>←</button>
        <h2 className="text-lg" style={{ color: bt.accent }}>🛒 상점</h2>
        <div className="flex gap-1.5">
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background: "rgba(255,255,255,0.6)" }}>
            <BlackPaw size={12} />
            <span className="text-[10px]" style={{ color: "#555" }}>{blackPaw.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background: "rgba(255,255,255,0.6)" }}>
            <WhitePaw size={12} />
            <span className="text-[10px]" style={{ color: "#B8A080" }}>{whitePaw.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="w-full max-w-[400px] flex gap-1.5 mb-3">
        {([["items", "🎒 아이템"], ["skins", "🎨 블록 스킨"], ["premium", "💎 충전"]] as const).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key as typeof tab)}
            className="flex-1 py-2 rounded-xl text-[10px] cursor-pointer transition-all"
            style={{
              background: tab === key ? bt.comboBadge : "rgba(255,255,255,0.5)",
              color: tab === key ? "white" : bt.accent,
            }}>{label}</button>
        ))}
      </div>

      {/* Items Tab */}
      {tab === "items" && (
        <div className="w-full max-w-[400px] space-y-2.5">
          {itemKeys.map(key => {
            const def = ITEM_DEFS[key];
            const count = items[key];
            const canAfford = blackPaw >= def.price;
            const isBuying = buyAnim === key;
            return (
              <div key={key} className="rounded-2xl overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.65)",
                  border: selectedItem === key ? `2px solid ${bt.accent}` : `2px solid ${bt.accent}20`,
                  transform: isBuying ? "scale(1.02)" : "scale(1)",
                  transition: "all 0.2s ease",
                }}>
                <button onClick={() => setSelectedItem(selectedItem === key ? null : key)}
                  className="w-full flex items-center gap-3 p-3.5 cursor-pointer" style={{ background: "transparent" }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "rgba(255,220,230,0.3)" }}>{getItemIcon(key, 36)}</div>
                  <div className="flex-1 text-left">
                    <p className="text-sm" style={{ color: bt.accent }}>{def.name}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <BlackPaw size={11} />
                      <span className="text-[11px]" style={{ color: canAfford ? "#555" : "#E55A5A" }}>{def.price}</span>
                    </div>
                  </div>
                  <div className="text-center shrink-0">
                    <p className="text-[8px]" style={{ color: bt.accentLight }}>보유</p>
                    <p className="text-lg" style={{ color: bt.accent }}>{count}</p>
                  </div>
                </button>
                {selectedItem === key && (
                  <div className="px-3.5 pb-3.5" style={{ borderTop: "1px solid rgba(255,181,194,0.15)" }}>
                    <p className="text-xs py-2.5" style={{ color: "#A0889A" }}>{def.desc}</p>
                    <button onClick={() => handleBuy(key)} disabled={!canAfford}
                      className="w-full py-2.5 rounded-xl text-sm text-white transition-all active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ background: canAfford ? bt.comboBadge : "rgba(200,180,190,0.5)" }}>
                      {canAfford ? <span className="flex items-center justify-center gap-2">구매하기 <BlackPaw size={13} /> {def.price}</span> : "포인트가 부족합니다"}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Block Skins Tab */}
      {tab === "skins" && (
        <div className="w-full max-w-[400px] space-y-2.5">
          {BLOCK_SKINS.filter(s => s.price > 0).map(skin => {
            const owned = progress.ownedSkins.includes(skin.id);
            const canAfford = whitePaw >= skin.price;
            const isBuying = buyAnim === skin.id;
            return (
              <div key={skin.id} className="rounded-2xl p-3.5"
                style={{
                  background: "rgba(255,255,255,0.65)",
                  border: "1px solid rgba(255,181,194,0.2)",
                  transform: isBuying ? "scale(1.02)" : "scale(1)",
                  transition: "all 0.2s ease",
                }}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{skin.emoji}</span>
                  <div className="flex-1">
                    <p className="text-sm" style={{ color: bt.accent }}>{skin.name} 블록 스킨</p>
                    <p className="text-[9px]" style={{ color: bt.accentLight }}>
                      가까이: {skin.nearReaction} · 멀리: {skin.farReaction}
                    </p>
                  </div>
                  <div className="flex gap-0.5">
                    {[0, 1, 2, 3, 4, 5].map(t => (
                      <CatCell key={t} catType={t as 0|1|2|3|4|5} size={18} skin={skin.id as BlockSkin} />
                    ))}
                  </div>
                </div>
                {owned ? (
                  <div className="text-center py-1.5 rounded-lg text-[11px]"
                    style={{ background: "rgba(100,200,100,0.1)", color: "#4CAF50" }}>
                    ✅ 보유중
                  </div>
                ) : (
                  <button onClick={() => handleBuySkin(skin.id as BlockSkin)} disabled={!canAfford}
                    className="w-full py-2 rounded-xl text-sm text-white transition-all active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background: canAfford ? "linear-gradient(135deg, #D4BC96, #B8A080)" : "rgba(200,180,190,0.5)" }}>
                    {canAfford ? <span className="flex items-center justify-center gap-2"><WhitePaw size={13} /> {skin.price.toLocaleString()} 구매</span> : "프리미엄 포인트 부족"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Premium Tab */}
      {tab === "premium" && (
        <div className="w-full max-w-[400px] space-y-3">
          <div className="rounded-2xl p-4 text-center"
            style={{ background: "rgba(255,255,255,0.6)", border: "1px solid rgba(212,188,150,0.3)" }}>
            <div className="flex items-center justify-center gap-2 mb-1">
              <WhitePaw size={22} />
              <span className="text-lg" style={{ color: "#B8A080" }}>프리미엄 포인트</span>
            </div>
            <p className="text-2xl mb-1" style={{ color: "#B8A080" }}>{whitePaw.toLocaleString()}</p>
            <p className="text-[10px]" style={{ color: "#D4B8C8" }}>실제 결제로 얻을 수 있는 특수 재화입니다</p>
          </div>

          {/* Starter Pack */}
          <button onClick={handleStarterPackPurchase}
            className="w-full rounded-2xl p-4 cursor-pointer transition-all active:scale-[0.98] relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(255,215,0,0.12), rgba(255,183,77,0.15))",
              border: "2px solid rgba(255,183,77,0.4)",
            }}>
            <div className="absolute top-0 right-0 px-2 py-0.5 rounded-bl-lg text-[8px] text-white"
              style={{ background: "linear-gradient(135deg, #FF8F00, #FF6F00)" }}>BEST</div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{ background: "linear-gradient(135deg, #FFD54F, #FF8F00)" }}>🎁</div>
              <div className="flex-1 text-left">
                <p className="text-sm" style={{ color: "#E87300" }}>스타터 팩</p>
                <p className="text-[9px]" style={{ color: "#B8A080" }}>
                  츄르 5 + 고양이풀 3 + 꾹꾹이 2 + 5,000P
                </p>
              </div>
              <div className="px-3 py-2 rounded-xl text-xs text-white"
                style={{ background: "linear-gradient(135deg, #FF8F00, #FF6F00)" }}>
                ₩6,500
              </div>
            </div>
          </button>

          {/* Premium packages */}
          {PREMIUM_PACKAGES.map(pkg => (
            <button key={pkg.id}
              onClick={() => handlePremiumPurchase(pkg)}
              className="w-full rounded-2xl p-4 flex items-center gap-3 cursor-pointer transition-all active:scale-[0.98]"
              style={{ background: "rgba(255,255,255,0.65)", border: "1px solid rgba(212,188,150,0.25)" }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center relative"
                style={{ background: "linear-gradient(135deg, #D4BC96, #B8A080)" }}>
                <WhitePaw size={24} />
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <p className="text-sm" style={{ color: "#B8A080" }}>{pkg.amount.toLocaleString()} 포인트</p>
                  {pkg.bonus && (
                    <span className="px-1.5 py-0.5 rounded text-[8px] text-white"
                      style={{ background: "linear-gradient(135deg, #FF6B6B, #FF8E53)" }}>
                      {pkg.bonus}
                    </span>
                  )}
                </div>
                <p className="text-[10px]" style={{ color: "#D4B8C8" }}>{pkg.price}</p>
              </div>
              <div className="px-4 py-2 rounded-xl text-xs text-white"
                style={{ background: "linear-gradient(135deg, #D4BC96, #B8A080)" }}>
                구매
              </div>
            </button>
          ))}

          {/* Currency Exchange: Premium → Regular */}
          <div className="rounded-2xl p-4"
            style={{ background: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,181,194,0.2)" }}>
            <p className="text-sm text-center mb-3" style={{ color: bt.accent }}>💱 재화 교환</p>
            <p className="text-[10px] text-center mb-3" style={{ color: "#C3A0B1" }}>
              프리미엄 포인트로 일반 포인트를 구매할 수 있습니다 (1:1)
            </p>
            <div className="grid grid-cols-3 gap-2">
              {[{ w: 100, b: 100 }, { w: 500, b: 500 }, { w: 1000, b: 1000 }].map(ex => (
                <button key={ex.w}
                  onClick={() => {
                    if (whitePaw >= ex.w) {
                      onExchangeCurrency(ex.w);
                      playPurchase();
                    } else playHiss();
                  }}
                  disabled={whitePaw < ex.w}
                  className="py-2.5 rounded-xl text-center cursor-pointer transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: whitePaw >= ex.w ? "rgba(255,220,230,0.4)" : "rgba(200,190,200,0.2)" }}>
                  <div className="flex items-center justify-center gap-0.5 mb-1">
                    <WhitePaw size={10} />
                    <span className="text-[10px]" style={{ color: "#B8A080" }}>{ex.w}</span>
                  </div>
                  <span className="text-[9px]" style={{ color: "#C3A0B1" }}>↓</span>
                  <div className="flex items-center justify-center gap-0.5 mt-0.5">
                    <BlackPaw size={10} />
                    <span className="text-[10px]" style={{ color: "#555" }}>{ex.b}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Ad Removal */}
          {!adRemoved ? (
            <button
              onClick={handleAdRemovalPurchase}
              className="w-full rounded-2xl p-4 flex items-center gap-3 cursor-pointer transition-all active:scale-[0.98]"
              style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.7), rgba(255,240,245,0.8))", border: "2px solid rgba(232,115,154,0.3)" }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{ background: bt.comboBadge }}>
                🚫
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm" style={{ color: bt.accent }}>광고 제거 (No Ads)</p>
                <p className="text-[10px]" style={{ color: "#C3A0B1" }}>배너/전면 광고 영구 삭제</p>
              </div>
              <div className="px-4 py-2 rounded-xl text-xs text-white"
                style={{ background: bt.comboBadge }}>
                ₩3,000
              </div>
            </button>
          ) : (
            <div className="w-full rounded-2xl p-4 flex items-center gap-3"
              style={{ background: "rgba(100,200,100,0.08)", border: "1px solid rgba(100,200,100,0.2)" }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{ background: "rgba(100,200,100,0.15)" }}>
                ✅
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm" style={{ color: "#4CAF50" }}>광고 제거 완료</p>
                <p className="text-[10px]" style={{ color: "#A0889A" }}>모든 광고가 제거되었습니다</p>
              </div>
            </div>
          )}

          {/* Restore Purchases */}
          <button onClick={handleRestore} disabled={restoring}
            className="w-full py-2.5 rounded-xl text-xs cursor-pointer transition-all active:scale-95 disabled:opacity-50"
            style={{ background: "rgba(255,255,255,0.4)", color: "#C3A0B1", border: "1px solid rgba(255,181,194,0.15)" }}>
            {restoring ? "복원 중..." : "🔄 구매 복원 (Restore Purchases)"}
          </button>

          <p className="text-[8px] text-center px-4" style={{ color: "#D4B8C8" }}>
            * 결제는 App Store / Google Play를 통해 처리됩니다.{"\n"}
            * 데모 환경에서는 모의 결제가 진행됩니다.
          </p>
        </div>
      )}
    </div>
  );
}