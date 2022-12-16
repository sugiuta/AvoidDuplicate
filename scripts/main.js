import { world } from "@minecraft/server"

let itemList = [];

class itemInfo {
    constructor (id, data) {
        this.id = id;
        this.data = data;
    }
}

world.events.tick.subscribe(tick => {
    if ((tick.currentTick % 2) != 0) return; // 0.1秒ごとに実行
    let players = world.getAllPlayers(); // 全てのプレイヤーを取得

    for (let player of players) {
        let component = player.getComponent(`minecraft:inventory`); // EntityInventoryComponent
        let container = component.container; // InventoryComponentContainer
        let item = container.getItem(player.selectedSlot);

        if (item == undefined) continue; // 手持ちがない場合はundefinedが返る
        let itemData = new itemInfo(item.typeId, item.data);
        itemList.push(itemData);
    }

    let result = itemList.filter(function (x, i, array) { // 重複を削除した配列を生成
        return array.findIndex(function (y) {
          return y.id === x.id && y.data === x.data;
        }) === i
    });

    if (result.length != itemList.length) { // アイテムが重複していた場合
        world.getDimension(`overworld`).runCommandAsync(`kill @e[type=player]`);
    }

    itemList.length = 0; // 配列の初期化
});