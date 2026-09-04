class WasteTransaction {
    constructor(id, user_id, school_id, waste_type, weight_kg, coin_amount, status, verified_by, created_at) {
        this.id = id;
        this.user_id = user_id;
        this.school_id = school_id;
        this.waste_type = waste_type;
        this.weight_kg = weight_kg;
        this.coin_amount = coin_amount;
        this.status = status;
        this.verified_by = verified_by;
        this.created_at = created_at;
    }
}

module.exports = WasteTransaction;
