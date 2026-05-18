import { _decorator, Component, Node, SpriteFrame, Sprite, Vec2, UITransform, Layers } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('ImageFont')
export default class ImageFont extends Component {

    @property(SpriteFrame)
    spriteFrames: SpriteFrame[] = [];

    @property
    isComma: boolean = false;

    @property(SpriteFrame)
    commaSpriteFrame: SpriteFrame = null!;

    private container: Node = null!;
    private sprites: Sprite[] = [];
    private pivot: Vec2 = new Vec2(0.5, 0.5);

    onLoad() {
        // 컨테이너 노드 생성 및 레이어 설정 (UI 노드는 레이어 설정이 필수입니다)
        this.container = new Node('container');
        this.container.layer = Layers.Enum.UI_2D;
        this.container.addComponent(UITransform);
        this.node.addChild(this.container);

        // 콤마 설정 로직 (기존 배열 인덱스 방식 대신 문자열 키를 지원하기 위해 맵 구조 고려 가능)
        // 3.x에서는 일반 배열 인덱스에 문자를 넣는 방식이 불안정할 수 있어 주의가 필요합니다.
    }

    setText(text: string) {
        let i = 0;
        let totalWidth = 0;
        let maxHeight = 0;

        for (i = 0; i < text.length; i++) {
            const char = text[i];
            let sprite = this.sprites[i];

            if (!sprite) {
                sprite = this.createSprite();
            }

            sprite.node.active = true;

            // 문자 검색 (배열 인덱스 숫자로 변환)
            let frame: SpriteFrame | null = null;
            if (char === ',' && this.isComma) {
                frame = this.commaSpriteFrame;
            } else {
                const index = parseInt(char);
                frame = this.spriteFrames[index];
            }

            if (frame) {
                sprite.spriteFrame = frame;
                const transform = sprite.getComponent(UITransform)!;

                // 위치 설정
                sprite.node.setPosition(totalWidth, 0);

                // 크기 누적 (간격 4 추가)
                totalWidth += transform.width + 4;
                if (maxHeight < transform.height) {
                    maxHeight = transform.height;
                }
            }
        }

        // 남는 스프라이트 비활성화
        for (; i < this.sprites.length; i++) {
            this.sprites[i].node.active = false;
        }

        // 피벗 기준 정렬 (UITransform을 사용하여 좌표 계산)
        const actualWidth = totalWidth > 0 ? totalWidth - 4 : 0;
        this.container.setPosition(-actualWidth * this.pivot.x, -maxHeight * this.pivot.y);
    }

    setNumberText(number: number) {
        // toLocaleString()은 콤마를 포함한 문자열을 반환합니다.
        if (this.isComma) {
            this.setText(number.toLocaleString());
        } else {
            this.setText(number.toString());
        }
    }

    setPivot(x: number, y: number) {
        this.pivot.x = x;
        this.pivot.y = y;
    }

    private createSprite(): Sprite {
        const node = new Node(this.sprites.length.toString());
        node.layer = Layers.Enum.UI_2D; // UI 레이어 설정 필수

        const transform = node.addComponent(UITransform);
        transform.setAnchorPoint(0, 0); // 좌하단 기준

        const sprite = node.addComponent(Sprite);
        // sprite.sizeMode = Sprite.SizeMode.RAW; // 원본 크기 유지 모드

        this.container.addChild(node);
        this.sprites.push(sprite);
        return sprite;
    }
}