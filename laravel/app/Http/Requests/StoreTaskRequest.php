<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // open demo board; return a Gate/Policy check in a real app
    }

    /** @return array<string, array<int, string>> */
    public function rules(): array
    {
        return [
            'title'    => ['required', 'string', 'max:255'],
            'priority' => ['nullable', 'in:low,normal,high'],
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'title.required' => 'The title field is required.',
            'title.max'      => 'The title may not be greater than 255 characters.',
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'title'    => trim((string) $this->input('title')),
            'priority' => $this->input('priority', 'normal'),
        ]);
    }
}
