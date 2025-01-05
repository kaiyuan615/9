function calculateRetirementPlan() {
    // 獲取用戶輸入
    const currentAge = parseInt(document.getElementById("currentAge").value);
    const retirementAge = parseInt(document.getElementById("retirementAge").value);
    const lifeExpectancy = parseInt(document.getElementById("lifeExpectancy").value);
    const monthlyExpenses = parseFloat(document.getElementById("monthlyExpenses").value);
    const considerInflation = document.getElementById("considerInflation").value === "yes";
    const existingAssets = parseFloat(document.getElementById("existingAssets").value);
    const socialInsurance = getSocialInsuranceValue();  // 使用自定義的函數來取得社會保險收入
    const investmentMode = document.getElementById("investmentMode").value;
    const expectedReturn = parseFloat(document.getElementById("expectedReturn").value) / 100;

    // 檢查欄位是否填寫完整
    if (isNaN(currentAge) || isNaN(retirementAge) || isNaN(lifeExpectancy) || 
        isNaN(monthlyExpenses) || isNaN(existingAssets) || isNaN(socialInsurance) || 
        isNaN(expectedReturn)) {
        document.getElementById("result").textContent = "請填寫所有欄位！";
        return;
    }

    // 計算退休所需總額
    const retirementYears = lifeExpectancy - retirementAge;
    let totalExpenses = monthlyExpenses * 12 * retirementYears;

    // 考慮通膨影響
    if (considerInflation) {
        const inflationRate = 0.02; // 假設通膨率 2%
        const yearsToRetirement = retirementAge - currentAge;
        totalExpenses *= Math.pow(1 + inflationRate, yearsToRetirement);  // 通膨影響應該是退休前的年數
    }

    // 減去已準備金額與社會保險
    const adjustedExpenses = totalExpenses - (existingAssets + socialInsurance * 12 * retirementYears);

    // 計算缺口並建議投入方式
    let suggestion = "";
    if (investmentMode === "lumpSum") {
        suggestion = `一次性投入 ${adjustedExpenses.toFixed(2)} 元`;
    } else {
        const yearsToInvest = retirementAge - currentAge;
        const monthlyInvestment = adjustedExpenses / (yearsToInvest * 12);
        suggestion = `每月需要投入 ${monthlyInvestment.toFixed(2)} 元`;
    }

    // 顯示結果
    document.getElementById("result").textContent = `總缺口為 ${adjustedExpenses.toFixed(2)} 元。建議：${suggestion}`;
}

// 取得社會保險收入值（考慮是否選擇「自行填寫」）
function getSocialInsuranceValue() {
    const socialInsuranceSelect = document.getElementById("socialInsurance");
    const customInput = document.getElementById("customSocialInsurance");

    // 如果選擇"自行填寫"，使用自訂值；否則使用選單值
    return parseFloat(customInput.style.display === "block" ? customInput.value : socialInsuranceSelect.value) || 0;
}
