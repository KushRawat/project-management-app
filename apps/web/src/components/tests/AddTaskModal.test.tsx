import { render, screen } from '@testing-library/react';
import AddTaskModal, { Assignee, Priority } from '../AddTaskModal';

describe('<AddTaskModal />', () => {
  it('shows the title input and Add Task button', () => {
    render(
      <AddTaskModal
        isOpen={true}
        onClose={() => {}}
        assignees={[]}
        priorities={['High', 'Low']}
        onSubmit={async () => {}}
      />,
    );
    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
    expect(screen.getByText(/Add Task/i)).toBeInTheDocument();
  });
});
