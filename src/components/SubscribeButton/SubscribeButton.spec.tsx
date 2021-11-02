import { fireEvent, render, screen } from "@testing-library/react";
import { mocked } from "ts-jest/utils";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/client";
import SubscribeButton from ".";

jest.mock("next/router");

jest.mock("next-auth/client");

let useSessionMocked = mocked(useSession);

describe("SubscribeButton component", () => {
  it("renders correctly", () => {
    useSessionMocked.mockReturnValueOnce([null, false]);
    render(<SubscribeButton />);

    expect(screen.getByText("Subscribe now")).toBeInTheDocument();
  });

  it("redirects user to sign in when not authenticated", () => {
    const signInMocked = mocked(signIn);
    useSessionMocked.mockReturnValueOnce([null, false]);

    render(<SubscribeButton />);

    const subscribeButton = screen.getByText("Subscribe now");

    fireEvent.click(subscribeButton);

    expect(signInMocked).toHaveBeenCalled();
  });

  it("redirects to posts when user already has a subscription", () => {
    const useRouterMocked = mocked(useRouter);

    useSessionMocked.mockReturnValueOnce([
      {
        user: {
          name: "John Doe",
          email: "john.doe@example.com",
        },
        activeSubscription: "fake",
        expires: "fake@expires",
      },
      false,
    ]);

    const pushMock = jest.fn();

    useRouterMocked.mockReturnValueOnce({
      push: pushMock,
    } as any);

    render(<SubscribeButton />);

    const subscribeButton = screen.getByText("Subscribe now");

    fireEvent.click(subscribeButton);

    expect(pushMock).toHaveBeenCalled();
  });
});
