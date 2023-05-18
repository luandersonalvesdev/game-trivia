import React from "react";
import { screen } from "@testing-library/react";
import { dataAPI, fail } from "./helpers/mockAPI";
import renderWithRouterAndRedux from "./helpers/renderWithRouterAndRedux";
import App from "../App";
import userEvent from "@testing-library/user-event";
import mockLocalStorage from "./helpers/mockLocalStorage";
import { act } from "react-dom/test-utils";

const initialState = {
    player: {
        gravatarEmail: '',
        name: '',
        score: 0,
        assertions: 0,
      }
}

describe('Testa a página de game', () => {
	beforeEach(() => {
		jest.spyOn(global, 'fetch').mockResolvedValue({
			json: async () => (dataAPI)
		});
		jest.useFakeTimers();
	})

	it('Verifica se ao entrar na página de game renderiza a pergunta', async() => {
		renderWithRouterAndRedux(<App />, initialState, '/game')

		expect(fetch).toHaveBeenCalled();

		const getQuestion = await screen.findByTestId('question-category');
		const getTextEl = screen.getByTestId('question-text');
		const answersButtons = screen.getByTestId('answer-options');
		const correctAnswer = screen.getByTestId('correct-answer');


		expect(getQuestion).toBeInTheDocument();
		expect(getTextEl).toBeInTheDocument();
		expect(answersButtons).toBeInTheDocument();
		expect(correctAnswer).toBeInTheDocument();
	});

	it('Verifica se o botão de next não existe enquanto não tem resposta', async() => {
		renderWithRouterAndRedux(<App />, initialState, '/game');

		const correctAnswer = await screen.findByTestId('correct-answer');
		const wrongAnswer = screen.getByRole('button', {  name: /ageia/i});
		
		
		
		const nextBtn = screen.queryByTestId('btn-next');
		expect(nextBtn).not.toBeInTheDocument();
		
		userEvent.click(correctAnswer);

		expect(correctAnswer).toBeDisabled();
		expect(wrongAnswer).toBeDisabled();
		expect(correctAnswer).toHaveClass('green');
		expect(wrongAnswer).toHaveClass('red');
		
		const nextBtn2 = screen.getByTestId('btn-next');
		expect(nextBtn2).toBeInTheDocument();
		userEvent.click(nextBtn2)
		
		const nextQuestion = screen.getByText(  /in magic: the gathering, what card&#039;s flavor text is &quot;catch!&quot;\?/i  );
		const firstQuestion = screen.queryByText(  /Who is the original author of the realtime physics engine called PhysX?\?/i  );
		expect(nextQuestion).toBeInTheDocument();
		expect(firstQuestion).not.toBeInTheDocument();  
	})

	it('Verifica se é redirecionado para a página de feedback na ultima pergunta', async() => {
		const {history} = renderWithRouterAndRedux(<App />, initialState, '/game');

		const fQuestion = await screen.findByText(  /Who is the original author of the realtime physics engine called PhysX?\?/i  );
		expect(fQuestion).toBeInTheDocument();
		const firstQuestion1 = screen.getByRole('button', { name: /NovodeX/i });
		expect(firstQuestion1).toBeInTheDocument();
		
		
		userEvent.click(firstQuestion1);

		const nextBtn = screen.getByTestId('btn-next');
		expect(nextBtn).toBeInTheDocument();
		userEvent.click(nextBtn)
		
		const nextQuestion = screen.getByRole('button', { name: /Lava Axe/i });
		expect(nextQuestion).toBeInTheDocument();
		userEvent.click(nextQuestion);

		const nextBtn2 = await screen.findByTestId('btn-next');
		userEvent.click(nextBtn2)

		const nextQuestion2 = screen.getByRole('button', { name: /Ice/i });
		expect(nextQuestion2).toBeInTheDocument();
		userEvent.click(nextQuestion2);

		const nextBtn3 = await screen.findByTestId('btn-next');
		userEvent.click(nextBtn3);

		const nextQuestion3 = screen.getByRole('button', { name: /Gun Usage/i });
		expect(nextQuestion3).toBeInTheDocument();
		userEvent.click(nextQuestion3);

		const nextBtn4 = await screen.findByTestId('btn-next');
		userEvent.click(nextBtn4);

		const nextQuestion4 = screen.getByRole('button', { name: /Roger Federer/i });
		expect(nextQuestion4).toBeInTheDocument();
		userEvent.click(nextQuestion4);

		expect(nextQuestion4.className).toBe('green');

		localStorage.setItem('rankingTrivia', JSON.stringify(mockLocalStorage));

		const nextBtn5 = await screen.findByTestId('btn-next');
		userEvent.click(nextBtn5);

		expect(history.location.pathname).toBe('/feedback')
	});

	it('Verifica se ao entrar na página de game renderiza a pergunta', async() => {
		renderWithRouterAndRedux(<App />, initialState, '/game')

		const btnFirstQuestionEl = await screen.findByRole('button', { name: 'AMD' });
		expect(btnFirstQuestionEl).toBeInTheDocument();

		for(let i = 0; i < 31; i += 1) {
			act(() => {
				jest.advanceTimersByTime(1000);
			});
		};

		const btnNextEl = screen.getByRole('button', { name: /next/i });
		expect(btnNextEl).toBeInTheDocument();

	});

	it('Verifica se ao entrar na página de game renderiza a pergunta', async() => {
		jest.spyOn(global, 'fetch').mockResolvedValue({
			json: async () => fail,
		});
		renderWithRouterAndRedux(<App />, initialState, '/game');

		const btnPlayEl = await screen.findByRole('button', { name: /play/i });
		expect(btnPlayEl).toBeInTheDocument();
	});

})

