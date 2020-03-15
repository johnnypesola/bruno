import React from 'react';
import styled from 'styled-components';
import { CardInHand } from '../App';
import { CardColor, CardValue } from './Card';
import { randomEnum } from '../utils';

const Container = styled.div`
    margin: 2px;
    display: inline-block;
    border: 6px solid white;
    border-radius: 5px;
    padding: 20px 17px;
    background: black;
    position: relative;
    color: black;
    height: 60px;
    width: 30px;
    user-select: none;
`;

const Text = styled.div`
    color: brown;
    font-size: 12px;
    font-weight: bold;
    transform: rotate(12deg);
`

interface ComponentProps {
    onGetCard: (newCard: CardInHand) => void
}

export const getRandomCard = (): CardInHand => {
    return { color: randomEnum(CardColor), value: randomEnum(CardValue)}
}

const CardPile: React.FC<ComponentProps> = ({onGetCard}) => {
    const onClickHandler = () => {
        onGetCard(getRandomCard());
    }    

    return (
        <Container onClick={onClickHandler}>
            <Text>
                Bruno
            </Text>
        </Container>
    )
}

export default CardPile;