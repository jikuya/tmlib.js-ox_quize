/*
 * ○×クイズ
 */

tm.game.setup({
    title: "◯✕クイズ",
    startLabel: "title",
});

tm.define("GameScene", {
    superClass: "Scene",

    init: function() {
        this.superInit();

        // スコア用変数
        this.score = 0;

        // 問題用変数
        this.questions = QUESTIONS.concat();

        // 問題文用ラベル
        this.questionLabel = Label("").addChildTo(this);// シーンに追加
        this.questionLabel.x = SCREEN_GRID_X.center();  // x 座標
        this.questionLabel.y = SCREEN_GRID_Y.span(5);   // y 座標
        this.questionLabel.fillStyle = "#222";          // 色
        this.questionLabel.fontSize = 32;               // サイズ

        // ◯ボタンを生成
        this.correctButton = SpriteButton("correct").addChildTo(this);
        this.correctButton.x = SCREEN_GRID_X.span(4);   // x 座標
        this.correctButton.y = SCREEN_GRID_Y.span(10);  // y 座標
        // ◯ボタンを押した時の処理を設定
        this.correctButton.onpush = function() {
            this.judge(true);
        }.bind(this);

        // ✕ボタンを生成
        this.incorrectButton = SpriteButton("incorrect").addChildTo(this);
        this.incorrectButton.x = SCREEN_GRID_X.span(-4);
        this.incorrectButton.y = SCREEN_GRID_Y.span(10);
        // ✕ボタンを押した時の処理を設定
        this.incorrectButton.onpush = function() {
            this.judge(false);
        }.bind(this);
    },

    onenter: function() {
        this.setQuestion();
    },

    update: function(app) {
        return ;
    },

    // 問題の設定
    setQuestion: function() {
        var q = this.questions.pickup();
        this.questions.erase(q);
        this.questionLabel.text = q.text;

        this.questionLabel.alpha = 0;
        this.questionLabel.tweener.clear().fadeIn(500);

        this.question = q;
    },

    // 正解・不正解の判定処理
    judge: function(answer) {
        if (this.question.answer === answer) {
            this.score++;
            SoundManager.play('correct_se');
            // 設定する問題がなくなったら終了
            if (this.questions.length <= 0) {
                this.clear();
            }
            else {
                this.setQuestion();
            }
        }
        else {
            this.score--;
            SoundManager.play('incorrect_se');
        }
    },

    // クリア処理
    clear: function() {
        this.nextArguments = {
            score: this.score,
        };
        this.app.popScene();

        // 繰り返しスタート用に問題をセット
        this.questions = QUESTIONS.concat()

        // スコアを送信
        gspread.post('ox_quize', {
            score: this.score,
        });
    },

});
