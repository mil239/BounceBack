type Props = 
{
    goToSignup: () => void;
    goToReset: () => void;
};

export default function LoginScren({ goToSignup, goToReset }: Props)
{
    <Button title = "Sign Up" onPress = {goToSignup} />
    <Button title = "Forgot Password?" onPress = {goToReset} />
}